import * as xlsx from "xlsx";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import {
  createDetailWorkDeparture,
  existsDetailWorkDeparture,
  I_DepartureJob,
  I_DepartureJobBBDD,
  I_DepartureJobExcel,
  I_DepartureJobUpdate,
} from "./models/departureJob.interface";
import { departureValidation } from "../departure.validation";
import { projectValidation } from "../../project/project.validation";
import {
  DetalleTrabajoPartida,
  ParteDiario,
  Partida,
  Proyecto,
  Trabajo,
} from "@prisma/client";
import { jobValidation } from "../../job/job.validation";
import { departureJobValidation } from "./departureJob.validation";
import { prismaDepartureJobRepository } from "./prisma-departure-job.repository";
import {
  T_FindAllDepartureJob,
  T_FindAllWork,
} from "./models/departure-job.types";
import { prismaJobRepository } from "../../job/prisma-job.repository";
import { isNumeric } from "validator";
import { dailyPartReportValidation } from "../../dailyPart/dailyPart.validation";
// import { fork } from "child_process";
// import path from "path";
// import { envConfig } from "../../config/env.config";

class DepartureJobService {
  async createDetailJobDeparture(data: I_DepartureJob) {
    try {
      const jobResponse = await jobValidation.findById(data.job_id);
      if (!jobResponse.success) {
        return jobResponse;
      }
      const job = jobResponse.payload as Trabajo;

      const departureResponse = await departureValidation.findById(
        data.departure_id
      );

      if (!departureResponse.success) {
        return departureResponse;
      }

      const departure = departureResponse.payload as Partida;

      let additionMetradoPrice = 0;
      const resultadoMetradoPrecio = data.metrado * departure.precio;

      additionMetradoPrice = resultadoMetradoPrecio + job.costo_partida;

      let additionMetradoCostOfLabor = 0;

      const resultMetadoCostOfLabor =
        data.metrado * departure.mano_de_obra_unitaria;
      additionMetradoCostOfLabor =
        resultMetadoCostOfLabor + job.costo_mano_obra;

      let addtionMetadoMaterialCost = 0;

      const resultMetradoMaterialCost =
        data.metrado * departure.material_unitario;
      addtionMetadoMaterialCost =
        resultMetradoMaterialCost + job.costo_material;

      let addtionMetradoJobEquipment = 0;

      const resultMetradoJobEquipment =
        data.metrado * departure.equipo_unitario;
      addtionMetradoJobEquipment = resultMetradoJobEquipment + job.costo_equipo;

      let addtionMetradoJobSeveral = 0;

      const resultMetradoJobSeveral =
        data.metrado * departure.subcontrata_varios;
      addtionMetradoJobSeveral = resultMetradoJobSeveral + job.costo_varios;

      const jobFormat = {
        ...job,
        costo_partida: additionMetradoPrice,
        costo_mano_obra: additionMetradoCostOfLabor,
        costo_material: addtionMetadoMaterialCost,
        costo_equipo: addtionMetradoJobEquipment,
        costo_varios: addtionMetradoJobSeveral,
      };

      const detailFindResponse =
        await departureJobValidation.findByForDepartureAndJob(
          departure.id,
          job.id
        );

      const detailFind = detailFindResponse.payload as DetalleTrabajoPartida;

      let total = 0;

      if (detailFindResponse.success) {
        const newMetrado = detailFind.cantidad_total + data.metrado;
        if (data.metrado > departure.metrado_total) {
          return httpResponse.BadRequestException(
            "Se encontró un Detalle con el mismo Trabajo y Partida pero se supera el metrado de la Partida"
          );
        }
        const updateDetail =
          await prismaDepartureJobRepository.updateDetailDepartureJob(
            detailFind.id,
            departure.id,
            newMetrado
          );
        //[note] actualizamos el metrado total de la Partida del Detalle Existente
        total = departure.metrado_total - data.metrado;
        await departureValidation.updateDepartureMetradoTotal(
          departure.id,
          total
        );

        await jobValidation.updateJob(jobFormat, job.id);

        return httpResponse.SuccessResponse(
          `Al existir un Detalle Trabajo-Partida, se ha actualizado con éxito el mismo`,
          updateDetail
        );
      }

      if (data.metrado > departure.metrado_total) {
        return httpResponse.BadRequestException(
          "El metrado ingresado supera al de la Partida"
        );
      }

      await jobValidation.updateJob(jobFormat, job.id);

      total = departure.metrado_total - data.metrado;
      //[note] actualizamos el metrado total de la Partida
      await departureValidation.updateDepartureMetradoTotal(
        departure.id,
        total
      );

      const departureJob =
        await departureJobValidation.createDetailDepartureJob(
          job.id,
          departure.id,
          data.metrado
        );
      return httpResponse.SuccessResponse(
        "Éxito al crear el Detalle de la Partida con su Trabajo",
        departureJob.payload
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al leer la Partida con su Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateDepartureJob(
    detail_id: number,
    data: I_DepartureJobUpdate
  ): Promise<T_HttpResponse> {
    try {
      const detailFind = await this.getDetailJobById(detail_id);
      if (!detailFind.success) {
        return httpResponse.BadRequestException(
          "No se encontró el Detalle Trabajo Partida que se quiere editar"
        );
      }
      const departureResponse = await this.getDepartureById(data.departure_id);
      if (!departureResponse.success) {
        return httpResponse.BadRequestException(
          "El id ingresado de la Partida no existe en la Base de datos"
        );
      }

      const detail = detailFind.payload as I_DepartureJobBBDD;
      const departure = departureResponse.payload as Partida;

      const existsDetailDepartureJobResponse =
        await this.checkExistingDepartureJob(departure.id, detail.trabajo_id);
      const detailExist =
        existsDetailDepartureJobResponse.payload as I_DepartureJobBBDD;

      //[note] verificamos si es el mismo detalle ya que si es el mismo no lo eliminamos

      if (
        existsDetailDepartureJobResponse.success &&
        detail.partida_id === detailExist.partida_id &&
        detail.trabajo_id === detailExist.trabajo_id &&
        detail.cantidad_total === data.metrado
      ) {
        // return await this.updateNewDepartureJob(detail, departure, data);
        return httpResponse.SuccessResponse(
          "Detalle Trabajo-Partida editado con éxito",
          detail
        );
        // return httpResponse.SuccessResponse("va a editar el mismo ");
      } else if (
        existsDetailDepartureJobResponse.success &&
        detailExist.partida_id != detail.partida_id &&
        detail.trabajo_id == detailExist.trabajo_id
      ) {
        //[note] acá edita uno existencial
        return await this.updateExistingDepartureJob(
          detail,
          detailExist,
          departure,
          data.metrado
        );
      } else {
        //[note] acá edito el mismo
        return await this.updateOldDepartureJob(detail, departure, data);
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en editar el Detalle Trabajo-Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  private async updateExistingDepartureJob(
    detail: I_DepartureJobBBDD,
    existsDetail: I_DepartureJobBBDD,
    departureNew: Partida,
    metrado: number
  ): Promise<T_HttpResponse> {
    if (metrado > departureNew.metrado_total) {
      return httpResponse.BadRequestException(
        "El metrado supera al de la Nueva Partida"
      );
    }

    //[note] aca multiplicamos
    const oldMetradoPrecio =
      existsDetail.cantidad_total * departureNew.precio +
      existsDetail.Trabajo.costo_partida;
    const oldMetadoCostOfLabor =
      existsDetail.cantidad_total * departureNew.mano_de_obra_unitaria +
      existsDetail.Trabajo.costo_mano_obra;
    const oldMetradoMaterialCost =
      existsDetail.cantidad_total * departureNew.material_unitario +
      existsDetail.Trabajo.costo_material;
    const oldMetradoJobEquipment =
      existsDetail.cantidad_total * departureNew.equipo_unitario +
      existsDetail.Trabajo.costo_equipo;
    const oldMetradoJobSeveral =
      existsDetail.cantidad_total * departureNew.subcontrata_varios +
      existsDetail.Trabajo.costo_varios;

    const newMetradoPrecio =
      metrado * departureNew.precio + existsDetail.Trabajo.costo_partida;

    if (newMetradoPrecio < oldMetradoPrecio) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el Costo de la Partida`
      );
    }

    const newMetadoCostOfLabor =
      metrado * departureNew.mano_de_obra_unitaria +
      existsDetail.Trabajo.costo_mano_obra;

    if (newMetadoCostOfLabor < oldMetadoCostOfLabor) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el Costo de la Mano de Obra Unitaria`
      );
    }
    const newMetradoMaterialCost =
      metrado * departureNew.material_unitario +
      existsDetail.Trabajo.costo_material;
    if (newMetradoMaterialCost < oldMetradoMaterialCost) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el costo de Material`
      );
    }
    const newMetradoJobEquipment =
      metrado * departureNew.equipo_unitario +
      existsDetail.Trabajo.costo_equipo;
    if (newMetradoJobEquipment < oldMetradoJobEquipment) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el costo de Equipo`
      );
    }
    const newMetradoJobSeveral =
      metrado * departureNew.subcontrata_varios +
      existsDetail.Trabajo.costo_varios;
    if (newMetradoJobSeveral < oldMetradoJobSeveral) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el costo Varios`
      );
    }

    //[note]acá calculamos los nuevos costos del Trabajo

    const jobFormat = this.calculateJobCosts(
      existsDetail,
      departureNew,
      metrado
    );
    await jobValidation.updateJob(jobFormat, existsDetail.Trabajo.id);
    //[note] acá le sumamos al Detalle de la vieja partida
    const addtotal = detail.Partida.metrado_total + detail.cantidad_total;

    await departureValidation.updateDepartureMetradoTotal(
      detail.Partida.id,
      addtotal
    );

    //[note]acá le restamos a la nueva partida
    const subtractTotal = departureNew.metrado_total - metrado;

    await departureValidation.updateDepartureMetradoTotal(
      departureNew.id,
      subtractTotal
    );

    //[note] acá actualizamos el valor del metrado utilizado
    const newMetrado = existsDetail.cantidad_total + metrado;

    const updateDetail =
      await prismaDepartureJobRepository.updateDetailDepartureJob(
        existsDetail.id,
        departureNew.id,
        newMetrado
      );

    //[note] acá eliminamos el detalle viejo
    await prismaDepartureJobRepository.deleteDetailDepartureJob(detail.id);
    return httpResponse.SuccessResponse(
      "Ya habia un Detalle Trabajo Partida con la Partida que pasaste por lo que esa fue editada",
      updateDetail
    );
  }

  private async updateOldDepartureJob(
    detail: I_DepartureJobBBDD,
    departure: Partida,
    data: I_DepartureJobUpdate
  ): Promise<T_HttpResponse> {
    if (detail.partida_id != departure.id) {
      if (data.metrado > departure.metrado_total) {
        return httpResponse.BadRequestException(
          "El metrado supera al metrado disponible de la nueva Partida"
        );
      }

      //[note] acá le restamos al metrado total de la nueva Partida
      const newtotal = departure.metrado_total - data.metrado;

      await departureValidation.updateDepartureMetradoTotal(
        departure.id,
        newtotal
      );

      //[note] acá le sumamos al metrado total de la vieja Partida
      const updateMetradoOldDeparture =
        detail.Partida.metrado_total + detail.cantidad_total;

      await departureValidation.updateDepartureMetradoTotal(
        detail.Partida.id,
        updateMetradoOldDeparture
      );
    } else {
      if (data.metrado > detail.Partida.metrado_total) {
        return httpResponse.BadRequestException(
          "El metrado supera al de la Partida"
        );
      }
      let totalOld = 0;
      const detailsResponse =
        await departureJobValidation.findAllWithOutPaginationForDeparture(
          detail.partida_id
        );

      const details = detailsResponse.payload as DetalleTrabajoPartida[];

      if (details.length > 0) {
        details.forEach((detailFind) => {
          if (detailFind.id != detail.id) {
            totalOld += detail.cantidad_total;
          }
        });

        let totalMoreNewValore = totalOld + data.metrado;
        if (totalMoreNewValore > departure.metrado_inicial) {
          return httpResponse.BadRequestException(
            "No puede colocar más métrado del que tiene la partida"
          );
        }
      }
      let total = 0;
      if (data.metrado > detail.cantidad_total) {
        const subtotal = data.metrado - detail.cantidad_total;
        total = detail.Partida.metrado_total - subtotal;
      } else {
        const subtotal = detail.cantidad_total - data.metrado;
        total = detail.Partida.metrado_total + subtotal;
      }

      //[note] acá sacamos el cálculo del nuevao metrado total de acuerdo a la diferencia del nuevo con el viejo

      await departureValidation.updateDepartureMetradoTotal(
        departure.id,
        total
      );
    }

    const jobFormat = this.calculateNewJobCosts(
      detail,
      departure,
      data.metrado
    );
    await jobValidation.updateJob(jobFormat, detail.Trabajo.id);

    const updateDetail =
      await prismaDepartureJobRepository.updateDetailDepartureJob(
        detail.id,
        departure.id,
        data.metrado
      );

    return httpResponse.SuccessResponse(
      "Detalle Trabajo Partida editado correctamente",
      updateDetail
    );
  }

  private calculateJobCosts(
    existsDetail: I_DepartureJobBBDD,
    departure: Partida,
    metrado: number
  ) {
    const aditionMetradoPrecio = metrado * departure.precio;
    const aditionMetadoCostOfLabor = metrado * departure.mano_de_obra_unitaria;
    const aditionMetradoMaterialCost = metrado * departure.material_unitario;
    const aditionMetradoJobEquipment = metrado * departure.equipo_unitario;
    const aditionMetradoJobSeveral = metrado * departure.subcontrata_varios;

    return {
      ...existsDetail.Trabajo,
      costo_partida: existsDetail.Trabajo.costo_partida + aditionMetradoPrecio,
      costo_mano_obra:
        existsDetail.Trabajo.costo_mano_obra + aditionMetadoCostOfLabor,
      costo_material:
        existsDetail.Trabajo.costo_material + aditionMetradoMaterialCost,
      costo_equipo:
        existsDetail.Trabajo.costo_equipo + aditionMetradoJobEquipment,
      costo_varios:
        existsDetail.Trabajo.costo_varios + aditionMetradoJobSeveral,
    };
  }

  private calculateNewJobCosts(
    detail: I_DepartureJobBBDD,
    departure: Partida,
    metrado: number
  ) {
    const subtractMetradoPrecio =
      detail.cantidad_total * detail.Partida.precio;
    const subtractMetadoCostOfLabor =
      detail.cantidad_total * detail.Partida.mano_de_obra_unitaria;
    const subtractMetradoMaterialCost =
      detail.cantidad_total * detail.Partida.material_unitario;
    const subtractMetradoJobEquipment =
      detail.cantidad_total * detail.Partida.equipo_unitario;
    const subtractMetradoJobSeveral =
      detail.cantidad_total * detail.Partida.subcontrata_varios;

    const aditionMetradoPrecio = metrado * departure.precio;
    const aditionMetadoCostOfLabor = metrado * departure.mano_de_obra_unitaria;
    const aditionMetradoMaterialCost = metrado * departure.material_unitario;
    const aditionMetradoJobEquipment = metrado * departure.equipo_unitario;
    const aditionMetradoJobSeveral = metrado * departure.subcontrata_varios;

    return {
      ...detail.Trabajo,
      costo_partida:
        detail.Trabajo.costo_partida +
        aditionMetradoPrecio -
        subtractMetradoPrecio,
      costo_mano_obra:
        detail.Trabajo.costo_mano_obra +
        aditionMetadoCostOfLabor -
        subtractMetadoCostOfLabor,
      costo_material:
        detail.Trabajo.costo_material +
        aditionMetradoMaterialCost -
        subtractMetradoMaterialCost,
      costo_equipo:
        detail.Trabajo.costo_equipo +
        aditionMetradoJobEquipment -
        subtractMetradoJobEquipment,
      costo_varios:
        detail.Trabajo.costo_varios +
        aditionMetradoJobSeveral -
        subtractMetradoJobSeveral,
    };
  }

  private async getDetailJobById(detail_id: number): Promise<T_HttpResponse> {
    return await departureJobValidation.findById(detail_id);
  }

  private async getDepartureById(
    departure_id: number
  ): Promise<T_HttpResponse> {
    return await departureValidation.findById(departure_id);
  }

  private async checkExistingDepartureJob(
    departure_id: number,
    trabajo_id: number
  ): Promise<T_HttpResponse> {
    return await departureJobValidation.findByForDepartureAndJob(
      departure_id,
      trabajo_id
    );
  }

  async updateStatusDepartureJob(
    departureJob_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detailFind = await prismaDepartureJobRepository.findById(
        departureJob_id
      );
      if (!detailFind) {
        return httpResponse.BadRequestException(
          "No se encontró el Detalle Trabajo Partida que se quiere eliminar"
        );
      }
      const jobResponse = await jobValidation.findById(detailFind.trabajo_id);
      const job = jobResponse.payload as Trabajo;
      const departureResponse = await departureValidation.findById(
        detailFind.partida_id
      );
      const departure = departureResponse.payload as Partida;

      let totalMetradoPrice = 0;
      const resultadoMetradoPrecio =
        detailFind.cantidad_total * departure.precio;

      totalMetradoPrice = job.costo_partida - resultadoMetradoPrecio;

      let totalMetradoCostOfLabor = 0;
      const resultMetadoCostOfLabor =
        detailFind.cantidad_total * departure.mano_de_obra_unitaria;

      totalMetradoCostOfLabor = job.costo_mano_obra - resultMetadoCostOfLabor;

      let totalMetadoMaterialCost = 0;
      const resultMetradoMaterialCost =
        detailFind.cantidad_total * departure.material_unitario;

      totalMetadoMaterialCost = job.costo_material - resultMetradoMaterialCost;

      let totalMetradoJobEquipment = 0;

      const resultMetradoJobEquipment =
        detailFind.cantidad_total * departure.equipo_unitario;
      totalMetradoJobEquipment = job.costo_equipo - resultMetradoJobEquipment;

      let totalMetradoJobSeveral = 0;

      const resultMetradoJobSeveral =
        detailFind.cantidad_total * departure.subcontrata_varios;
      totalMetradoJobSeveral = resultMetradoJobSeveral + job.costo_varios;

      const jobFormat = {
        ...job,
        costo_partida: totalMetradoPrice,
        costo_mano_obra: totalMetradoCostOfLabor,
        costo_material: totalMetadoMaterialCost,
        costo_equipo: totalMetradoJobEquipment,
        costo_varios: totalMetradoJobSeveral,
      };
      const total = departure.metrado_total + detailFind.cantidad_total;
      const updateDepartureResponse =
        await departureValidation.updateDepartureMetradoTotal(
          departure.id,
          total
        );

      if (!updateDepartureResponse.success) {
        return updateDepartureResponse;
      }
      await prismaJobRepository.updateJob(jobFormat, job.id);
      await prismaDepartureJobRepository.deleteDetailDepartureJob(
        departureJob_id
      );
      return httpResponse.SuccessResponse(
        "Detalle Trabajo Partida eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar el Detalle Trabajo-Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAllDepartureJob, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const project = projectResponse.payload as Proyecto;

      const result =
        await prismaDepartureJobRepository.findAllWithPaginationForJob(
          skip,
          data,
          project.id
        );

      const { detailsDepartureJob, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: detailsDepartureJob,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trabajos y sus Partidas",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trabajos y sus Partidas",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAllForJob(
    data: T_FindAllWork,
    project_id: string,
    daily_part_id: number
  ) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const project = projectResponse.payload as Proyecto;

      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);

      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }

      const dailyPart = dailyPartResponse.payload as ParteDiario;

      const result = await prismaDepartureJobRepository.findAllForJob(
        skip,
        data,
        project.id,
        dailyPart.trabajo_id
      );

      const { details, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: details,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trabajos y sus Partidas de acuerdo al Trabajo que se ha pasado",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trabajos y sus Partidas de acuerdo al Trabajo que se ha pasado",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAllForDetail(data: T_FindAllDepartureJob, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const result =
        await prismaDepartureJobRepository.findAllWithPaginationForDetail(
          skip,
          data,
          +project_id
        );

      const { detailsDepartureJob, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: detailsDepartureJob,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trabajos y sus Partidas del Detalle",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trabajos y sus Partidas del Detalle",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateDepartureJobMasive(file: any, project_id: number) {
    try {
      const buffer = file.buffer;

      // [message] obtenemos la informacion

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(
        sheet
      ) as I_DepartureJobExcel[];

      // [message] validamos que el proyecto existe
      const responseProject = await projectValidation.findById(project_id);
      if (!responseProject.success) return responseProject;

      // [message] validamos la informacion y creamos los errores

      let error = 0;
      let errorNumber = 0;
      let errorRows: number[] = [];
      let errorMessages: string[] = [];

      //trabajo
      const jobsResponse = await jobValidation.findAllWithOutPagination(
        project_id
      );
      const jobs = jobsResponse.payload as Trabajo[];
      //partida
      const departuresResponse =
        await departureValidation.findAllWithOutPagination(project_id);
      const departures = departuresResponse.payload as Partida[];

      //Detalle Trabajo-Partida
      const detailsResponse =
        await departureJobValidation.findAllDepartureJobWithOutPagination(
          project_id
        );
      const details = detailsResponse.payload as I_DepartureJobBBDD[];

      //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
      //[NOTE] SI HAY 2 FILAS AL PRINCIPIO VACIAS
      //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
      //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
      //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
      //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
      //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO

      //[NOTE] ACÁ VERIFICA SI HAY 2 FILAS VACIAS
      //Usamos rango 0 para verificar q estamos leyendo las primeras filas
      const firstTwoRows: any = xlsx.utils
        .sheet_to_json(sheet, { header: 1, range: 0, raw: true })
        .slice(0, 2); //nos limitamos a las primeras 2
      //verificamos si están vacias las primeras filas
      const isEmptyRow = (row: any[]) =>
        row.every((cell) => cell === null || cell === undefined || cell === "");
      //verificamos si tiene menos de 2 filas o si en las primeras 2 esta vacia lanzamos el error
      if (
        firstTwoRows.length < 2 ||
        (isEmptyRow(firstTwoRows[0]) && isEmptyRow(firstTwoRows[1]))
      ) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. El archivo no puede tener arriba varias filas en blanco "
        );
      }

      // [error] correcion: no usar promesas
      sheetToJson.forEach((item: I_DepartureJobExcel, index: number) => {
        index++;
        if (
          item["ID-TRABAJO"] == undefined ||
          item.PARTIDA == undefined ||
          item.METRADO == undefined
        ) {
          error++;
          errorRows.push(index + 1);
        }
      });

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. Los campos ID-TRABAJO, PARTIDA y METRADO son obligatorios. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      sheetToJson.forEach((item: I_DepartureJobExcel, index: number) => {
        const jobExists = jobs.some((job) => job.codigo == item["ID-TRABAJO"]);

        if (!jobExists) {
          errorNumber++;
          errorRows.push(index + 1);
        }
      });

      // [error] correcion: no usar promesas

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id del Trabajo no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[validation] separar el id de la Partida y buscar si existe

      sheetToJson.forEach((item: I_DepartureJobExcel, index: number) => {
        const departureWithComa = item.PARTIDA.split(" ");
        const codeDeparture = departureWithComa[0];

        const departureExists = departures.some(
          (departure) => departure.id_interno == codeDeparture
        );

        if (!departureExists) {
          errorNumber++;
          errorRows.push(index + 1);
        }
      });
      // [error] correcion: no usar promesas

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id de la Partida no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      // //[note] verifico q no tenga letras el metrado

      sheetToJson.forEach((item: I_DepartureJobExcel, index: number) => {
        const withoutComma = String(item.METRADO).replace(",", "");
        if (!isNumeric(String(withoutComma))) {
          errorNumber++;
          errorRows.push(index + 1);
        }
      });
      // [error] correcion: no usar promesas

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.Hay letras en campos no autorizados.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }
      //[success] Verifico si el metrado supera al de la partida

      const departuresMap = new Map(
        departures.map((departure) => [departure.id_interno, departure])
      );

      sheetToJson.forEach((item: I_DepartureJobExcel, index: number) => {
        index++;
        const departureWithComa = item.PARTIDA.split(" ");
        const codeDeparture = departureWithComa[0];

        // Buscar el `departure` en el Map en lugar de recorrer toda la lista
        const departureExists = departuresMap.get(codeDeparture);

        if (!departureExists) {
          errorNumber++;
          errorRows.push(index + 1);
        } else if (
          departureExists.metrado_inicial &&
          Number(item.METRADO) > departureExists.metrado_inicial
        ) {
          error++;
          errorRows.push(index + 1);
        }
      });

      // [error] correcion: no usar promesas

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El metrado ingresado de la partida es mayor de la que está guardada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[SUCCESS] Guardo o actualizo el Detalle Trabajo-Partida

      //[message] lleno dentro de un map todos los detalles q hay
      const detailsMap = new Map<string, DetalleTrabajoPartida>();
      details.forEach((detail) => {
        const key = `${detail.trabajo_id}-${detail.partida_id}`;
        detailsMap.set(key, detail);
      });
      //[note] forma vieja
      // let existsDatInDetail: createDetailWorkDeparture[];
      // const responseFormatData: createDetailWorkDeparture[] = sheetToJson
      //   .map((item) => {
      //     const job = jobs.find((departure) => {
      //       return departure.codigo === item["ID-TRABAJO"];
      //     });
      //     const departure = departures.find((departure) => {
      //       return departure.id_interno === item.PARTIDA.split(" ")[0];
      //     });

      //     if (job && departure) {
      //       return {
      //         trabajo_id: job.id,
      //         partida_id: departure.id,
      //         metrado_utilizado: +item.METRADO,
      //       } as any;
      //     }
      //   })
      //   .filter(Boolean);

      let existsDataInDetail: existsDetailWorkDeparture[] = []; // Para registros que ya existen
      const responseFormatData: createDetailWorkDeparture[] = [];
      sheetToJson.forEach((item) => {
        const job = jobs.find((job) => job.codigo === item["ID-TRABAJO"]);
        const departure = departures.find(
          (departure) => departure.id_interno === item.PARTIDA.split(" ")[0]
        );

        if (job && departure) {
          const data = {
            trabajo_id: job.id,
            partida_id: departure.id,
            cantidad_total: +item.METRADO,
          } as createDetailWorkDeparture;

          const key = `${job.id}-${departure.id}`;

          if (detailsMap.has(key)) {
            const detail = detailsMap.get(key);
            if (detail && detail.id !== undefined) {
              existsDataInDetail.push({
                ...data,
                id: detail.id,
              });
            }
          } else {
            responseFormatData.push(data);
          }
        }
      });

      // await prisma.detalleTrabajoPartida.createMany({
      //   data: responseFormatData,
      // });
      if (responseFormatData.length > 0) {
        // console.log("entro a crear");
        await prisma.detalleTrabajoPartida.createMany({
          data: responseFormatData,
        });
        this.updateJobWithoutExistingDetail(
          responseFormatData,
          jobs,
          departures
        );
      }

      if (existsDataInDetail.length > 0) {
        // console.log("entro a editar");

        for (let index = 0; index < existsDataInDetail.length; index++) {
          const detail = details.find(
            (details) =>
              details.trabajo_id === existsDataInDetail[index].trabajo_id &&
              details.partida_id === existsDataInDetail[index].partida_id
          );

          if (
            detail?.cantidad_total !=
            existsDataInDetail[index].cantidad_total
          ) {
            // console.log("entro para editar el detalle id " + detail?.id);
            await prisma.detalleTrabajoPartida.update({
              where: {
                id: existsDataInDetail[index].id,
              },
              data: existsDataInDetail[index],
            });
          }
        }
        this.updateJobExistingDetail(existsDataInDetail, details, jobs);
      }

      // for (const item of sheetToJson) {
      //   const jobResponse = jobs.find(
      //     (job) => job.codigo === item["ID-TRABAJO"]
      //   );
      //   if (!jobResponse) {
      //     return httpResponse.BadRequestException(
      //       "No se encontró el id del trabajo que se quiere agregar en el Detalle"
      //     );
      //   }

      //   const departureWithComa = item.PARTIDA.split(" ");
      //   const codeDeparture = departureWithComa[0];
      //   const departureResponse = departures.find(
      //     (departure) => departure.id_interno === codeDeparture
      //   );

      //   if (!departureResponse) {
      //     return httpResponse.BadRequestException(
      //       "No se encontró la partida que se quiere agregar en el Detalle"
      //     );
      //   }

      //   await departureJobValidation.updateDepartureJob(
      //     item,
      //     +project_id,
      //     jobResponse,
      //     departureResponse
      //   );
      // }

      // for (const job of jobs) {
      //   await jobValidation.updateJob(job, job.id);
      // }

      return httpResponse.SuccessResponse(
        "Partidas y Trabajos actualizados correctamente!"
      );
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer las Partidas con sus Trabajos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  private async updateJobWithoutExistingDetail(
    detailsNews: createDetailWorkDeparture[],
    jobs: Trabajo[],
    departures: Partida[]
  ) {
    for (const item of detailsNews) {
      const job = jobs.find((job) => job.id === item.trabajo_id);
      const departure = departures.find(
        (departure) => departure.id === item.partida_id
      );
      if (!job) {
        return httpResponse.BadRequestException(
          "No se encontró el id del trabajo que se quiere agregar en el Detalle"
        );
      }

      if (!departure) {
        return httpResponse.BadRequestException(
          "No se encontró el id del trabajo que se quiere agregar en el Detalle"
        );
      }

      //[note] esto suma a lo q ya tiene
      await departureJobValidation.updateJobForAdd(
        item.cantidad_total,
        job,
        departure
      );
    }

    for (const job of jobs) {
      await jobValidation.updateJob(job, job.id);
    }
  }
  //[note] primer parametro paso lo nuevo y en el segundo lo viejo
  private async updateJobExistingDetail(
    detailsExisting: createDetailWorkDeparture[],
    details: I_DepartureJobBBDD[],
    jobs: Trabajo[]
  ) {
    let flag = false;
    for (const item of detailsExisting) {
      const detailOld = details.find(
        (details) =>
          details.trabajo_id === item.trabajo_id &&
          details.partida_id === item.partida_id
      );
      const job = jobs.find((job) => job.id === item.trabajo_id);
      //[message] muy pero muy importante buscar la referencia de memoria de cual es el trabajo al que vamos a editar
      //[message] ya que luego cuando editemos los trabajos ya se va a haber moficicado el trabajo
      if (!job) {
        return httpResponse.BadRequestException(
          "No se encontró el id del trabajo que se quiere agregar en el Detalle"
        );
      }

      if (!detailOld) {
        return httpResponse.BadRequestException(
          "No se encontró el detalle existente en la base de datos"
        );
      }

      if (detailOld?.cantidad_total != item.cantidad_total) {
        // console.log("hay que editar el id del trabajo " + detailOld.trabajo_id);
        flag = true;
        await departureJobValidation.updateJobForSubtractAndAdd(
          detailOld?.cantidad_total,
          item.cantidad_total,
          job,
          detailOld.Partida
        );
      }
    }
    if (flag) {
      for (const job of jobs) {
        await jobValidation.updateJob(job, job.id);
      }
    }
  }
}

export const departureJobService = new DepartureJobService();

//[message] deje esto de abajo xq es el codigo del script cuando lo hice funcionar
// async updateDepartureJobMasive(file: any, project_id: number) {
//   try {
//     const buffer = file.buffer;

//     const workbook = xlsx.read(buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const sheetToJson = xlsx.utils.sheet_to_json(
//       sheet
//     ) as I_DepartureJobExcel[];
//     let error = 0;
//     let errorNumber = 0;
//     let errorRows: number[] = [];
//     let errorMessages: string[] = [];
//     const responseProject = await projectValidation.findById(project_id);
//     if (!responseProject.success) return responseProject;
//     const project = responseProject.payload as Proyecto;

//     //trabajo
//     const jobsResponse = await jobValidation.findAllWithOutPagination(
//       project_id
//     );
//     const jobs = jobsResponse.payload as Trabajo[];
//     //partida
//     const departuresResponse =
//       await departureValidation.findAllWithOutPagination(project_id);
//     const departures = departuresResponse.payload as Partida[];
//     //unidad
//     const unitsResponse = await unitValidation.findAllWithOutPagination(
//       project_id
//     );
//     const units = unitsResponse.payload as Unidad[];
//     //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
//     //[NOTE] SI HAY 2 FILAS AL PRINCIPIO VACIAS
//     //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
//     //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
//     //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
//     //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
//     //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO

//     //[NOTE] ACÁ VERIFICA SI HAY 2 FILAS VACIAS
//     //Usamos rango 0 para verificar q estamos leyendo las primeras filas
//     const firstTwoRows: any = xlsx.utils
//       .sheet_to_json(sheet, { header: 1, range: 0, raw: true })
//       .slice(0, 2); //nos limitamos a las primeras 2
//     //verificamos si están vacias las primeras filas
//     const isEmptyRow = (row: any[]) =>
//       row.every((cell) => cell === null || cell === undefined || cell === "");
//     //verificamos si tiene menos de 2 filas o si en las primeras 2 esta vacia lanzamos el error
//     if (
//       firstTwoRows.length < 2 ||
//       (isEmptyRow(firstTwoRows[0]) && isEmptyRow(firstTwoRows[1]))
//     ) {
//       return httpResponse.BadRequestException(
//         "Error al leer el archivo. El archivo no puede tener arriba varias filas en blanco "
//       );
//     }

//     const seenCodes = new Set<string>();
//     let previousCodigo: number | null = null;

//     //[note] aca si hay espacio en blanco.
//     await Promise.all(
//       sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
//         index++;
//         if (
//           item["ID-TRABAJO"] == undefined ||
//           item.PARTIDA == undefined ||
//           item.METRADO == undefined
//         ) {
//           error++;
//           errorRows.push(index + 1);
//         }
//       })
//     );

//     if (error > 0) {
//       return httpResponse.BadRequestException(
//         `Error al leer el archivo. Los campos ID-TRABAJO, PARTIDA, UNIDAD y METRADO son obligatorios. Fallo en las siguientes filas: ${errorRows.join(
//           ", "
//         )}`
//       );
//     }

//     //[validation] buscar si existe el id del trabajo
//     await Promise.all(
//       sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
//         index++;

//         // const jobResponse = await jobValidation.findByCodeValidation(
//         //   item["ID-TRABAJO"],
//         //   project.id
//         // );
//         // if (!jobResponse.success) {
//         //   error++;
//         //   errorRows.push(index + 1);
//         // }

//         const jobExists = jobs.some(
//           (job) => job.codigo == item["ID-TRABAJO"]
//         );
//         if (!jobExists) {
//           errorNumber++;
//           errorRows.push(index + 1);
//         }
//       })
//     );

//     if (errorNumber > 0) {
//       return httpResponse.BadRequestException(
//         `Error al leer el archivo. El Id del Trabajo no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
//           ", "
//         )}`
//       );
//     }
//     //[validation] separar el id de la Partida y buscar si existe
//     await Promise.all(
//       sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
//         index++;
//         const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios

//         const codeDeparture = departureWithComa[0];

//         // const departureResponse =
//         //   await departureValidation.findByCodeValidation(
//         //     codeDeparture,
//         //     project.id
//         //   );
//         // if (!departureResponse.success) {
//         //   error++;
//         //   errorRows.push(index + 1);
//         // }

//         const departureExists = departures.some(
//           (departure) => departure.id_interno == codeDeparture
//         );
//         if (!departureExists) {
//           errorNumber++;
//           errorRows.push(index + 1);
//         }
//       })
//     );

//     if (errorNumber > 0) {
//       return httpResponse.BadRequestException(
//         `Error al leer el archivo. El Id de la Partida no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
//           ", "
//         )}`
//       );
//     }
//     //[validation] buscar si existe el id de la Unidad
//     await Promise.all(
//       sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
//         index++;

//         const unitExists = units.some(
//           (unit) =>
//             unit.simbolo?.toUpperCase() == item.UNIDAD.trim().toUpperCase()
//         );
//         if (!unitExists) {
//           errorNumber++;
//           errorRows.push(index + 1);
//         }
//       })
//     );

//     if (errorNumber > 0) {
//       return httpResponse.BadRequestException(
//         `Error al leer el archivo. El Id de la Unidad no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
//           ", "
//         )}`
//       );
//     }

//     // //[note] verifico q no tenga letras el metrado
//     await Promise.all(
//       sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
//         index++;
//         const withoutComma = String(item.METRADO).replace(",", "");
//         if (!isNumeric(String(withoutComma))) {
//           errorNumber++;
//           errorRows.push(index + 1);
//         }
//       })
//     );

//     if (errorNumber > 0) {
//       return httpResponse.BadRequestException(
//         `Error al leer el archivo.Hay letras en campos no autorizados.Verificar las filas: ${errorRows.join(
//           ", "
//         )}.`
//       );
//     }
//     //[success] Verifico si el metrado supera al de la partida
//     await Promise.all(
//       sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
//         index++;
//         const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios

//         const codeDeparture = departureWithComa[0];

//         // const departureResponse =
//         //   await departureValidation.findByCodeValidation(
//         //     codeDeparture,
//         //     project.id
//         //   );
//         // const partida = departureResponse.payload as Partida;
//         const departureExists = departures.find((departure) => {
//           return departure.id_interno == codeDeparture;
//         });
//         if (!departureExists) {
//           errorNumber++;
//           errorRows.push(index + 1);
//         }
//         if (departureExists?.metrado_inicial) {
//           if (Number(item.METRADO) > departureExists.metrado_inicial) {
//             error++;
//             errorRows.push(index + 1);
//           }
//         }
//       })
//     );

//     if (error > 0) {
//       return httpResponse.BadRequestException(
//         `Error al leer el archivo. El metrado ingresado de la partida es mayor de la que está guardada. Fallo en las siguientes filas: ${errorRows.join(
//           ", "
//         )}`
//       );
//     }

//     //[SUCCESS] Guardo o actualizo la Unidad de Producciónn
//     const route = envConfig.DEV
//       ? path.join(__dirname, "../../scripts/test.ts")
//       : path.join(__dirname, "../../scripts/test.js");
//     const scriptPath = route;

//     for (const item of sheetToJson) {
//       await departureJobValidation.updateDepartureJob(item, project_id);
//       const jobResponse = jobs.find((departure) => {
//         return departure.codigo === item["ID-TRABAJO"];
//       });

//       if (!jobResponse) {
//         return httpResponse.BadRequestException(
//           "No se encontró el id del trabajo que se quiere agregar en el Detalle"
//         );
//       }

//       const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios

//       const codeDeparture = departureWithComa[0];

//       const departureResponse = departures.find((departure) => {
//         return departure.id_interno === codeDeparture;
//       });

//       if (!departureResponse) {
//         return httpResponse.BadRequestException(
//           "No se encontró la partida que se quiere agregar en el Detalle"
//         );
//       }

//       // //[note] acá hacemos creacion de un proceso hijo
//       const child = fork(scriptPath, [
//         JSON.stringify(item),
//         String(project_id),
//         String(jobResponse.id),
//         String(departureResponse.id),
//       ]);
//       //[note]Aunque en el test.ts no veas explícitamente exit ni message, el proceso hijo utiliza process.send,
//       //[note] y el proceso padre recibe estos mensajes con child.on("message", ...) y child.on("exit", ...).

//       //[note] child.on("message", ...) en el proceso padre recibe y muestra el mensaje enviado desde el hijo.
//       // child.on("message", (message) => {
//       //   console.log(message);
//       // });

//       //[note] child.on("exit", ...) se ejecuta cuando el hijo finaliza, mostrando el código de salida
//       //[note] si termina con el codigo cero es q termino bien
//       child.on("exit", (code) => {
//         console.log(`El proceso hijo terminó con el código ${code}`);
//       });

//       // await departureJobValidation.createDetailDepartureJobFromExcel(
//       //   item,
//       //   project_id,
//       //   jobResponse.id,
//       //   departureResponse.id
//       // );
//     }

//     return httpResponse.SuccessResponse(
//       "Partidas y Trabajos actualizados correctamente!"
//     );
//   } catch (error) {
//     await prisma.$disconnect();
//     return httpResponse.InternalServerErrorException(
//       "Error al leer las Partidas con sus Trabajos",
//       error
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

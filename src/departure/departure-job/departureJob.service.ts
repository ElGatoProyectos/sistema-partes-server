import * as xlsx from "xlsx";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import {
  I_DepartureJob,
  I_DepartureJobBBDD,
  I_DepartureJobExcel,
  I_DepartureJobUpdate,
} from "./models/departureJob.interface";
import { departureValidation } from "../departure.validation";
import { projectValidation } from "@/project/project.validation";
import {
  DetalleTrabajoPartida,
  Partida,
  Proyecto,
  Trabajo,
} from "@prisma/client";
import { jobValidation } from "@/job/job.validation";
import { unitValidation } from "@/unit/unit.validation";
import { departureJobValidation } from "./departureJob.validation";
import { prismaDepartureJobRepository } from "./prisma-departure-job.repository";
import { T_FindAllDepartureJob } from "./models/departure-job.types";
import { prismaJobRepository } from "@/job/prisma-job.repository";
import { isNumeric } from "validator";

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

      if (data.metrado > departure.metrado_inicial) {
        return httpResponse.BadRequestException(
          "No puede colocar más métrado del que tiene la partida"
        );
      }

      const detailFind = await departureJobValidation.findByForDepartureAndJob(
        departure.id,
        job.id
      );
      const detail = detailFind.payload as DetalleTrabajoPartida;
      if (detailFind.success) {
        const newMetrado = detail.metrado_utilizado + data.metrado;
        const result = newMetrado > departure.metrado_inicial;
        if (result) {
          return httpResponse.BadRequestException(
            "Se encontró un Detalle con el mismo Trabajo y Partida pero con esta última suma supera el metrado de la Partida"
          );
        }
      }

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

      const jobUpdateResponse = await jobValidation.updateJob(
        jobFormat,
        job.id
      );
      if (!jobUpdateResponse.success) {
        return httpResponse.BadRequestException(
          "Hubo un problema para modificar el Trabajo de acuerdo a la Partida"
        );
      }
      if (detailFind.success) {
        const newMetrado = detail.metrado_utilizado + data.metrado;
        const updateDetail =
          await prismaDepartureJobRepository.updateDetailDepartureJob(
            detail.id,
            departure.id,
            newMetrado
          );
        return httpResponse.SuccessResponse(
          `Al existir un Detalle Trabajo-Partida, se ha actualizado con éxito el mismo`,
          updateDetail
        );
      }

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
        console.log("no encontro el detallee");
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

      if (data.metrado > departure.metrado_inicial) {
        return httpResponse.BadRequestException(
          "El metrado que ha colocado es mayor para la nueva Partida "
        );
      }
      const existsDetailDepartureJobResponse =
        await this.checkExistingDepartureJob(departure.id, detail.trabajo_id);
      const detailExist =
        existsDetailDepartureJobResponse.payload as I_DepartureJobBBDD;

      //[note] verificamos si es el mismo detalle ya que si es el mismo no lo eliminamos
      if (!existsDetailDepartureJobResponse.success) {
        return await this.updateNewDepartureJob(detail, departure, data);
      } else {
        return await this.updateExistingDepartureJob(
          detail,
          detailExist,
          departure,
          data.metrado
        );
      }
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error en editar el Detalle Trabajo-Partida",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
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

  private async updateExistingDepartureJob(
    detail: I_DepartureJobBBDD,
    existsDetail: I_DepartureJobBBDD,
    departure: Partida,
    metrado: number
  ): Promise<T_HttpResponse> {
    const newMetrado = existsDetail.metrado_utilizado + metrado;
    if (newMetrado > departure.metrado_inicial) {
      return httpResponse.BadRequestException(
        "Como se va a actualizar otro Detalle por esta Partida, la suma del metrado que envio con la ya tenia supera al metrado de la Partida"
      );
    }
    //[note] aca multiplicas
    const oldMetradoPrecio =
      existsDetail.metrado_utilizado * departure.precio +
      existsDetail.Trabajo.costo_partida;
    const oldMetadoCostOfLabor =
      existsDetail.metrado_utilizado * departure.mano_de_obra_unitaria +
      existsDetail.Trabajo.costo_mano_obra;
    const oldMetradoMaterialCost =
      existsDetail.metrado_utilizado * departure.material_unitario +
      existsDetail.Trabajo.costo_material;
    const oldMetradoJobEquipment =
      existsDetail.metrado_utilizado * departure.equipo_unitario +
      existsDetail.Trabajo.costo_equipo;
    const oldMetradoJobSeveral =
      existsDetail.metrado_utilizado * departure.subcontrata_varios +
      existsDetail.Trabajo.costo_varios;

    const newMetradoPrecio =
      metrado * departure.precio + existsDetail.Trabajo.costo_partida;

    if (newMetradoPrecio < oldMetradoPrecio) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el Costo de la Partida`
      );
    }

    const newMetadoCostOfLabor =
      metrado * departure.mano_de_obra_unitaria +
      existsDetail.Trabajo.costo_mano_obra;

    if (newMetadoCostOfLabor < oldMetadoCostOfLabor) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el Costo de la Mano de Obra Unitaria`
      );
    }
    const newMetradoMaterialCost =
      metrado * departure.material_unitario +
      existsDetail.Trabajo.costo_material;
    if (newMetradoMaterialCost < oldMetradoMaterialCost) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el costo de Material`
      );
    }
    const newMetradoJobEquipment =
      metrado * departure.equipo_unitario + existsDetail.Trabajo.costo_equipo;
    if (newMetradoJobEquipment < oldMetradoJobEquipment) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el costo de Equipo`
      );
    }
    const newMetradoJobSeveral =
      metrado * departure.subcontrata_varios +
      existsDetail.Trabajo.costo_varios;
    if (newMetradoJobSeveral < oldMetradoJobSeveral) {
      return httpResponse.BadRequestException(
        `Metrado del trabajo destino insuficiente para el costo Varios`
      );
    }

    const jobFormat = this.calculateJobCosts(existsDetail, departure, metrado);
    await jobValidation.updateJob(jobFormat, existsDetail.Trabajo.id);

    const updateDetail =
      await prismaDepartureJobRepository.updateDetailDepartureJob(
        existsDetail.id,
        departure.id,
        newMetrado
      );

    await prismaDepartureJobRepository.deleteDetailDepartureJob(detail.id);
    return httpResponse.SuccessResponse(
      "Ya habia un Detalle Trabajo Partida con la Partida que pasaste por lo que esa fue editada",
      updateDetail
    );
  }

  private async updateNewDepartureJob(
    detail: I_DepartureJobBBDD,
    departure: Partida,
    data: I_DepartureJobUpdate
  ): Promise<T_HttpResponse> {
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
      detail.metrado_utilizado * detail.Partida.precio;
    const subtractMetadoCostOfLabor =
      detail.metrado_utilizado * detail.Partida.mano_de_obra_unitaria;
    const subtractMetradoMaterialCost =
      detail.metrado_utilizado * detail.Partida.material_unitario;
    const subtractMetradoJobEquipment =
      detail.metrado_utilizado * detail.Partida.equipo_unitario;
    const subtractMetradoJobSeveral =
      detail.metrado_utilizado * detail.Partida.subcontrata_varios;

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
        detailFind.metrado_utilizado * departure.precio;

      totalMetradoPrice = job.costo_partida - resultadoMetradoPrecio;

      let totalMetradoCostOfLabor = 0;
      const resultMetadoCostOfLabor =
        detailFind.metrado_utilizado * departure.mano_de_obra_unitaria;

      totalMetradoCostOfLabor = job.costo_mano_obra - resultMetadoCostOfLabor;

      let totalMetadoMaterialCost = 0;
      const resultMetradoMaterialCost =
        detailFind.metrado_utilizado * departure.material_unitario;

      totalMetadoMaterialCost = job.costo_material - resultMetradoMaterialCost;

      let totalMetradoJobEquipment = 0;

      const resultMetradoJobEquipment =
        detailFind.metrado_utilizado * departure.equipo_unitario;
      totalMetradoJobEquipment = job.costo_equipo - resultMetradoJobEquipment;

      let totalMetradoJobSeveral = 0;

      const resultMetradoJobSeveral =
        detailFind.metrado_utilizado * departure.subcontrata_varios;
      totalMetradoJobSeveral = resultMetradoJobSeveral + job.costo_varios;

      const jobFormat = {
        ...job,
        costo_partida: totalMetradoPrice,
        costo_mano_obra: totalMetradoCostOfLabor,
        costo_material: totalMetadoMaterialCost,
        costo_equipo: totalMetradoJobEquipment,
        costo_varios: totalMetradoJobSeveral,
      };
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

  async updateDepartureJobMasive(file: any, project_id: number) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(
        sheet
      ) as I_DepartureJobExcel[];
      let error = 0;
      let errorNumber = 0;
      let errorRows: number[] = [];
      let errorMessages: string[] = [];
      const responseProject = await projectValidation.findById(project_id);
      if (!responseProject.success) return responseProject;
      const project = responseProject.payload as Proyecto;
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

      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;
          if (
            item["ID-TRABAJO"] == undefined ||
            item.PARTIDA == undefined ||
            item.UNIDAD == undefined ||
            item.METRADO == undefined
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. Los campos ID-TRABAJO, PARTIDA, UNIDAD y METRADO son obligatorios. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[note] buscar si existe el id del trabajo
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;

          const jobResponse = await jobValidation.findByCodeValidation(
            item["ID-TRABAJO"].trim(),
            project.id
          );
          if (!jobResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id del Trabajo no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] separar el id de la Partida y buscar si existe
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;
          const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios

          const codeDeparture = departureWithComa[0];

          const departureResponse =
            await departureValidation.findByCodeValidation(
              codeDeparture,
              project.id
            );
          if (!departureResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id de la Partida no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el id de la Unidad
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;

          const jobResponse = await unitValidation.findBySymbol(
            item.UNIDAD.trim(),
            project.id
          );
          if (!jobResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Id de la Unidad no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      // //[note] verifico q no tenga letras el metrado
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;
          if (item.METRADO) {
            const withoutComma = String(item.METRADO).replace(",", "");
            if (!isNumeric(String(withoutComma))) {
              errorNumber++;
              errorRows.push(index + 1);
            }
          }
        })
      );

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.Hay letras en campos no autorizados.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }
      //[success] Verifico si el metrado supera al de la partida
      await Promise.all(
        sheetToJson.map(async (item: I_DepartureJobExcel, index: number) => {
          index++;
          const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios

          const codeDeparture = departureWithComa[0];

          const departureResponse =
            await departureValidation.findByCodeValidation(
              codeDeparture,
              project.id
            );
          const partida = departureResponse.payload as Partida;

          if (partida.metrado_inicial) {
            if (Number(item.METRADO) > partida.metrado_inicial) {
              error++;
              errorRows.push(index + 1);
            }
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El metrado ingresado de la partida es mayor de la que está guardada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[SUCCESS] Guardo o actualizo la Unidad de Producciónn

      for (const item of sheetToJson) {
        await departureJobValidation.updateDepartureJob(item, project_id);
        await departureJobValidation.createDetailDepartureJobFromExcel(
          item,
          project_id
        );
      }
      await prisma.$disconnect();

      return httpResponse.SuccessResponse(
        "Partidas y Trabajos actualizados correctamente!"
      );
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer las Partidas con sus Trabajos",
        error
      );
    }
  }
  async findAll(data: T_FindAllDepartureJob, job_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;

      const jobResponse = await projectValidation.findById(+job_id);
      if (!jobResponse.success) {
        return jobResponse;
      }

      const job = jobResponse.payload as Trabajo;

      const result = await prismaDepartureJobRepository.findAll(
        skip,
        data,
        job.id
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
}

export const departureJobService = new DepartureJobService();

//  async updateDepartureJob(
//     detail_id: number,
//     data: I_DepartureJobUpdate
//   ): Promise<T_HttpResponse> {
//     try {
//       //[note] Buscas el detalle que queres editar
//       const detailFind = await departureJobValidation.findById(detail_id);
//       if (!detailFind) {
//         return httpResponse.BadRequestException(
//           "No se encontró el Detalle Trabajo Partida que se quiere editar"
//         );
//       }
//       //[note] Buscas la Partida que enviaste
//       const departureResponse = await departureValidation.findById(
//         data.departure_id
//       );
//       if (!departureResponse.success) {
//         return httpResponse.BadRequestException(
//           "El id ingresado de la Partida no existe en la Base de datos"
//         );
//       }
//       const departure = departureResponse.payload as Partida;
//       const detail = detailFind.payload as I_DepartureJobBBDD;

//       //[note] Comprobamos si hay algún detalle existente con el trabajo del detalle que buscamos antes y de la partida nueva
//       //[note] ya que si la hay editamos esa
//       const existsDetailDepartureJobResponse =
//         await departureJobValidation.findByForDepartureAndJob(
//           detail.trabajo_id,
//           departure.id
//         );

//       const existsDetailDepartureJob =
//         existsDetailDepartureJobResponse.payload as I_DepartureJobBBDD;

//       if (data.metrado > departure.metrado_inicial) {
//         return httpResponse.BadRequestException(
//           "El metrado que ha colocado es mayor para la nueva Partida "
//         );
//       }

//       if (existsDetailDepartureJobResponse.success) {
//         //[success] acá se edita el detalle existente
//         const aditionMetradoPrecio = data.metrado * departure.precio;

//         const aditionMetadoCostOfLabor =
//           data.metrado * departure.mano_de_obra_unitaria;

//         const aditionMetradoMaterialCost =
//           data.metrado * departure.material_unitario;

//         const aditionMetradoJobEquipment =
//           data.metrado * departure.equipo_unitario;

//         const aditionMetradoJobSeveral =
//           data.metrado * departure.subcontrata_varios;

//         const jobFormat = {
//           ...detail.Trabajo,
//           costo_partida: detail.Trabajo.costo_partida + aditionMetradoPrecio,
//           costo_mano_obra:
//             detail.Trabajo.costo_mano_obra + aditionMetadoCostOfLabor,
//           costo_material:
//             detail.Trabajo.costo_material + aditionMetradoMaterialCost,
//           costo_equipo:
//             detail.Trabajo.costo_equipo + aditionMetradoJobEquipment,
//           costo_varios: detail.Trabajo.costo_varios + aditionMetradoJobSeveral,
//         };
//         await jobValidation.updateJob(jobFormat, detail.Trabajo.id);
//         const newMetrado =
//           existsDetailDepartureJob.metrado_utilizado + data.metrado;
//         const updateDetail =
//           await prismaDepartureJobRepository.updateDetailDepartureJob(
//             existsDetailDepartureJob.id,
//             departure.id,
//             newMetrado
//           );
//         await prismaDepartureJobRepository.deleteDetailDepartureJob(detail.id);
//         return httpResponse.SuccessResponse(
//           "Ya habia un Detalle Trabajo Partida con la Partida que pasaste por lo que esa fue editada",
//           updateDetail
//         );
//       }

//       //[note] aca sacamos la resta de cuanto seria
//       const subtractMetradoPrecio =
//         detail.metrado_utilizado * detail.Partida.precio;

//       const subtractMetadoCostOfLabor =
//         detail.metrado_utilizado * detail.Partida.mano_de_obra_unitaria;

//       const subtractMetradoMaterialCost =
//         detail.metrado_utilizado * detail.Partida.material_unitario;

//       const subtractMetradoJobEquipment =
//         detail.metrado_utilizado * detail.Partida.equipo_unitario;

//       const subtractMetradoJobSeveral =
//         detail.metrado_utilizado * detail.Partida.subcontrata_varios;

//       //[note] acá sacamos el cálculo de la nueva partida para el trabajo
//       const aditionMetradoPrecio = data.metrado * departure.precio;

//       const aditionMetadoCostOfLabor =
//         data.metrado * departure.mano_de_obra_unitaria;

//       const aditionMetradoMaterialCost =
//         data.metrado * departure.material_unitario;

//       const aditionMetradoJobEquipment =
//         data.metrado * departure.equipo_unitario;

//       const aditionMetradoJobSeveral =
//         data.metrado * departure.subcontrata_varios;

//       //[success] acá finalmente sacamos la cuenta final para actualizarlo

//       const totalResultMetradoPrice =
//         detail.Trabajo.costo_partida +
//         aditionMetradoPrecio -
//         subtractMetradoPrecio;
//       const totalResultMetradoCostOfLabor =
//         detail.Trabajo.costo_mano_obra +
//         aditionMetadoCostOfLabor -
//         subtractMetadoCostOfLabor;
//       const totalResultMetradoMaterialCost =
//         detail.Trabajo.costo_material +
//         aditionMetradoMaterialCost -
//         subtractMetradoMaterialCost;
//       const totalResultMetradoJobEquipment =
//         detail.Trabajo.costo_equipo +
//         aditionMetradoJobEquipment -
//         subtractMetradoJobEquipment;
//       const totalResultMetradoJobSeveral =
//         detail.Trabajo.costo_varios +
//         aditionMetradoJobSeveral -
//         subtractMetradoJobSeveral;

//       const jobFormat = {
//         ...detail.Trabajo,
//         costo_partida: totalResultMetradoPrice,
//         costo_mano_obra: totalResultMetradoCostOfLabor,
//         costo_material: totalResultMetradoMaterialCost,
//         costo_equipo: totalResultMetradoJobEquipment,
//         costo_varios: totalResultMetradoJobSeveral,
//       };

//       await jobValidation.updateJob(jobFormat, detail.Trabajo.id);

//       const updateDetail =
//         await prismaDepartureJobRepository.updateDetailDepartureJob(
//           detail.id,
//           departure.id,
//           data.metrado
//         );

//       return httpResponse.SuccessResponse(
//         "Detalle Trabajo Partida editado correctamente",
//         updateDetail
//       );
//     } catch (error) {
//       return httpResponse.InternalServerErrorException(
//         "Error en editar el Detalle Trabajo-Partida",
//         error
//       );
//     } finally {
//       await prisma.$disconnect();
//     }
//   }

////////////////////////////////
// async createDetailJobDeparture(data: I_DepartureJob) {
//   try {
//     const jobResponse = await jobValidation.findById(data.job_id);
//     if (!jobResponse.success) {
//       return jobResponse;
//     }
//     const job = jobResponse.payload as Trabajo;

//     const departureResponse = await departureValidation.findById(
//       data.departure_id
//     );

//     if (!departureResponse.success) {
//       return departureResponse;
//     }

//     const departure = departureResponse.payload as Partida;

//     if (data.metrado > departure.metrado_inicial) {
//       return httpResponse.BadRequestException(
//         "No puede colocar más métrado del que tiene la partida"
//       );
//     }
//     const detailFind = await departureJobValidation.findByForDepartureAndJob(
//       departure.id,
//       job.id
//     );
//     const detail = detailFind.payload as DetalleTrabajoPartida;
//     if (detailFind.success) {
//       const newMetrado = detail.metrado_utilizado + data.metrado;
//       const result = newMetrado > departure.metrado_inicial;
//       if (result) {
//         return httpResponse.BadRequestException(
//           "Se encontró un Detalle con el mismo Trabajo y Partida pero con esta última suma supera el metrado de la Partida"
//         );
//       }
//     }

//     let additionMetradoPrice = 0;
//     const resultadoMetradoPrecio = data.metrado * departure.precio;

//     additionMetradoPrice = resultadoMetradoPrecio + job.costo_partida;
//     await prismaJobRepository.updateJobCost(additionMetradoPrice, job.id);

//     let additionMetradoCostOfLabor = 0;
//     const resultMetadoCostOfLabor =
//       data.metrado * departure.mano_de_obra_unitaria;
//     additionMetradoCostOfLabor =
//       resultMetadoCostOfLabor + job.costo_mano_obra;
//     await prismaJobRepository.updateJobCostOfLabor(
//       additionMetradoCostOfLabor,
//       job.id
//     );

//     let addtionMetadoMaterialCost = 0;
//     const resultMetradoMaterialCost =
//       data.metrado * departure.material_unitario;
//     addtionMetadoMaterialCost =
//       resultMetradoMaterialCost + job.costo_material;
//     await prismaJobRepository.updateJobMaterialCost(
//       addtionMetadoMaterialCost,
//       job.id
//     );

//     let addtionMetradoJobEquipment = 0;
//     const resultMetradoJobEquipment =
//       data.metrado * departure.equipo_unitario;
//     addtionMetradoJobEquipment = resultMetradoJobEquipment + job.costo_equipo;
//     await prismaJobRepository.updateJobEquipment(
//       addtionMetradoJobEquipment,
//       job.id
//     );

//     let addtionMetradoJobSeveral = 0;
//     const resultMetradoJobSeveral =
//       data.metrado * departure.subcontrata_varios;
//     addtionMetradoJobSeveral = resultMetradoJobSeveral + job.costo_varios;
//     await prismaJobRepository.updateJobSeveral(
//       addtionMetradoJobSeveral,
//       job.id
//     );

//     if (detailFind.success) {
//       const newMetrado = detail.metrado_utilizado + data.metrado;
//       const updateDetail =
//         await prismaDepartureJobRepository.updateDetailDepartureJob(
//           detail.id,
//           departure.id,
//           newMetrado
//         );
//       if (!updateDetail) {
//         return httpResponse.BadRequestException(
//           "El el proceso de actualizar el Detalle Trabajo-Partida hubo un problema"
//         );
//       }
//       return httpResponse.SuccessResponse(
//         `Al existir un Detalle Trabajo-Partida, se ha actualizado con éxito el mismo`
//       );
//     }

//     const departureJob =
//       await departureJobValidation.createDetailDepartureJob(
//         job.id,
//         departure.id,
//         data.metrado
//       );
//     return httpResponse.SuccessResponse(
//       "Éxito al el Detalle de la Partida con su Trabajo",
//       departureJob.payload
//     );
//   } catch (error) {
//     await prisma.$disconnect();
//     return httpResponse.InternalServerErrorException(
//       "Error al leer la Partida con su Trabajo",
//       error
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

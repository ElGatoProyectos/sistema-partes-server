import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { trainValidation } from "@/train/train.validation";
import { productionUnitValidation } from "@/production-unit/productionUnit.validation";
import { converToDate } from "@/common/utils/date";
import { jobValidation } from "./job.validation";
import { Trabajo, Usuario } from "@prisma/client";
import { I_CreateJobBody, I_UpdateJobBody } from "./models/job.interface";
import { prismaJobRepository } from "./prisma-job.repository";
import { projectValidation } from "@/project/project.validation";
import { T_FindAllJob } from "./models/job.types";
import { JobResponseMapper } from "./mappers/job.mapper";
import { userValidation } from "@/user/user.validation";
import * as xlsx from "xlsx";

class JobService {
  async createJob(
    data: I_CreateJobBody,
    project_id: string
  ): Promise<T_HttpResponse> {
    try {
      const trainResponse = await trainValidation.findById(+data.tren_id);
      if (!trainResponse.success) {
        return trainResponse;
      }
      // const train = trainResponse.payload as Tren;
      const upResponse = await productionUnitValidation.findById(+data.up_id);
      if (!upResponse) {
        return upResponse;
      }

      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      // const up = upResponse.payload as UnidadProduccion;
      const lastJob = await jobValidation.codeMoreHigh(+project_id);
      const lastJobResponse = lastJob.payload as Trabajo;

      const userResponse = await userValidation.findById(data.usuario_id);
      if (!userResponse.success) return userResponse;
      const user = userResponse.payload as Usuario;
      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastJobResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(4, "0");
      const fecha_inicio = converToDate(data.fecha_inicio);
      const fecha_finalizacion = converToDate(data.fecha_finalizacion);

      const jobFormat = {
        nombre: data.nombre,
        nota: data.nota ? data.nota : "",
        duracion: data.duracion,
        codigo: formattedCodigo,
        costo_partida: data.costo_partida != undefined ? data.costo_partida : 0,
        costo_mano_obra:
          data.costo_mano_obra != undefined ? data.costo_mano_obra : 0,
        costo_material:
          data.costo_material != undefined ? data.costo_material : 0,
        costo_equipo: data.costo_equipo != undefined ? data.costo_equipo : 0,
        costo_varios: data.costo_varios != undefined ? data.costo_varios : 0,
        fecha_inicio: fecha_inicio,
        fecha_finalizacion: fecha_finalizacion,
        up_id: data.up_id,
        tren_id: data.tren_id,
        proyecto_id: +project_id,
        usuario_id: user.id,
      };
      const jobResponse = await prismaJobRepository.createJob(jobFormat);
      return httpResponse.CreatedResponse(
        "Trabajo creado correctamente",
        jobResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusJob(job_id: number): Promise<T_HttpResponse> {
    try {
      const jobResponse = await jobValidation.findById(job_id);
      if (!jobResponse.success) {
        return jobResponse;
      } else {
        const result = await prismaJobRepository.updateStatusJob(job_id);
        return httpResponse.SuccessResponse(
          "Trabajo eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAll(data: T_FindAllJob, project_id: number) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaJobRepository.findAll(skip, data, +project_id);

      const { jobs, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: jobs,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trabajos",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trabajos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(job_id: number): Promise<T_HttpResponse> {
    try {
      const jobResponse = await prismaJobRepository.findById(job_id);
      if (!jobResponse) {
        return httpResponse.NotFoundException(
          "El id del Trabajo no fue no encontrado"
        );
      }
      return httpResponse.SuccessResponse("Trabajo encontrado", jobResponse);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateJob(
    data: I_UpdateJobBody,
    job_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdJob = await jobValidation.findById(job_id);
      if (!resultIdJob.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id del Trabajo que se quiere editar"
        );
      }
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede actualizar el Trabajo con el id del proyecto proporcionado"
        );
      }
      const resultJobFind = resultIdJob.payload as Trabajo;
      const userResponse = await userValidation.findById(data.usuario_id);
      if (!userResponse.success) return userResponse;
      const user = userResponse.payload as Usuario;
      if (resultJobFind.nombre != data.nombre) {
        const resultTrain = await trainValidation.findByName(
          data.nombre,
          +project_id
        );
        if (!resultTrain.success) {
          return resultTrain;
        }
      }
      const trainResponse = await trainValidation.findById(data.tren_id);
      if (!trainResponse.success) return trainResponse;

      const upResponse = await productionUnitValidation.findById(data.up_id);
      if (!upResponse.success) return upResponse;
      const fecha_inicio = converToDate(data.fecha_inicio);
      const fecha_finalizacion = converToDate(data.fecha_finalizacion);
      const trainFormat = {
        ...data,
        fecha_inicio: fecha_inicio,
        fecha_finalizacion: fecha_finalizacion,
        proyecto_id: +project_id,
        usuario_id: user.id,
      };
      const responseJob = await prismaJobRepository.updateJob(
        trainFormat,
        project_id
      );
      const jobMapper = new JobResponseMapper(responseJob);
      return httpResponse.SuccessResponse(
        "Trabajo modificado correctamente",
        jobMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  // async registerJobMasive(file: any, projectId: number) {
  //   try {
  //     const buffer = file.buffer;

  //     const workbook = xlsx.read(buffer, { type: "buffer" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const sheetToJson = xlsx.utils.sheet_to_json(
  //       sheet
  //     ) as I_JobExcel[];
  //     let error = 0;
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
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }

  //     const project = await projectValidation.findById(projectId);
  //     if (!project.success) return project;
  //     const responseProject = project.payload as Proyecto;
  //     let errorNumber = 0;
  //     const seenCodes = new Set<string>();
  //     let previousCodigo: number | null = null;

  //     //[note] aca si hay espacio en blanco.
  //     await Promise.all(
  //       sheetToJson.map(async (item: I_ProductionUnitExcel, index: number) => {
  //         index++;
  //         if (
  //           item.CODIGO == undefined ||
  //           item.NOMBRE == undefined ||
  //           item.NOTA == undefined
  //         ) {
  //           error++;
  //         }
  //       })
  //     );

  //     if (error > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }

  //     //[note] Acá verificamos que el codigo no tenga letras ni que sea menor que el anterior
  //     await Promise.all(
  //       sheetToJson.map(async (item: I_ProductionUnitExcel) => {
  //         //verificamos si tenemos el codigo
  //         const codigo = parseInt(item.CODIGO, 10); // Intenta convertir el string a número

  //         if (!validator.isNumeric(item.CODIGO)) {
  //           errorNumber++; // Aumenta si el código no es un número válido
  //         } else {
  //           // Verifica si el código ya ha sido procesado
  //           if (!seenCodes.has(item.CODIGO)) {
  //             // errorNumber++; // Aumenta si hay duplicado
  //             seenCodes.add(item.CODIGO);
  //           }

  //           // Verifica si el código actual no es mayor que el anterior
  //           if (previousCodigo !== null && codigo <= previousCodigo) {
  //             errorNumber++;
  //           }

  //           previousCodigo = codigo;
  //         }
  //       })
  //     );

  //     if (errorNumber > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }

  //     //[NOTE] Acá verifico si el primer elemento es 001
  //     const sortedCodesArray = Array.from(seenCodes)
  //       .map((item) => item.padStart(3, "0"))
  //       .sort((a, b) => parseInt(a) - parseInt(b));

  //     if (sortedCodesArray[0] != "001") {
  //       errorNumber++;
  //     }

  //     if (errorNumber > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }
  //     //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
  //     for (let i = 1; i < sortedCodesArray.length; i++) {
  //       const currentCode = parseInt(sortedCodesArray[i]);
  //       const previousCode = parseInt(sortedCodesArray[i - 1]);

  //       if (currentCode !== previousCode + 1) {
  //         errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
  //         break; // Puedes detener el ciclo en el primer error
  //       }
  //     }

  //     if (errorNumber > 0) {
  //       return httpResponse.BadRequestException(
  //         "Error al leer el archivo. Verificar los campos"
  //       );
  //     }

  //     //[SUCCESS] Guardo o actualizo la Unidad de Producción
  //     let code;
  //     let productionUnit;
  //     await Promise.all(
  //       sheetToJson.map(async (item: I_ProductionUnitExcel) => {
  //         code = await productionUnitValidation.findByCode(
  //           String(item.CODIGO),
  //           responseProject.id
  //         );
  //         if (!code.success) {
  //           productionUnit = code.payload as UnidadProduccion;
  //           await productionUnitValidation.updateProductionUnit(
  //             item,
  //             +productionUnit.id,
  //             responseProject.id
  //           );
  //         } else {
  //           await prisma.unidadProduccion.create({
  //             data: {
  //               codigo: String(item.CODIGO),
  //               nombre: item.NOMBRE,
  //               nota: item.NOTA,
  //               proyecto_id: responseProject.id,
  //             },
  //           });
  //         }
  //       })
  //     );

  //     await prisma.$disconnect();

  //     return httpResponse.SuccessResponse(
  //       "Unidad de producción creada correctamente!"
  //     );
  //   } catch (error) {
  //     await prisma.$disconnect();
  //     return httpResponse.InternalServerErrorException(
  //       "Error al leer la Unidad de Producción",
  //       error
  //     );
  //   }
  // }
}

export const jobService = new JobService();

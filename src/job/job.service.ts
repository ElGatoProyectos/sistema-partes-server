import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { trainValidation } from "@/train/train.validation";
import { productionUnitValidation } from "@/production-unit/productionUnit.validation";
import { converToDate } from "@/common/utils/date";
import { jobValidation } from "./job.validation";
import {
  E_Trabajo_Estado,
  Proyecto,
  Trabajo,
  Tren,
  UnidadProduccion,
  Usuario,
} from "@prisma/client";
import {
  I_CreateJobBody,
  I_JobExcel,
  I_UpdateJobBody,
} from "./models/job.interface";
import { prismaJobRepository } from "./prisma-job.repository";
import { projectValidation } from "@/project/project.validation";
import { T_FindAllJob } from "./models/job.types";
import { JobResponseMapper } from "./mappers/job.mapper";
import { userValidation } from "@/user/user.validation";
import * as xlsx from "xlsx";
import validator from "validator";
import { jwtService } from "@/auth/jwt.service";

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
  async registerJobMasive(file: any, projectId: number, token: string) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet) as I_JobExcel[];

      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

      let error = 0;
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
          "Error al leer el archivo. Verificar los campos"
        );
      }

      const project = await projectValidation.findById(projectId);
      if (!project.success) return project;
      const responseProject = project.payload as Proyecto;
      let errorNumber = 0;
      const seenCodes = new Set<string>();
      let previousCodigo: number | null = null;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_JobExcel, index: number) => {
          index++;
          if (
            item["ID-TRABAJO"] == undefined ||
            item.TRABAJOS == undefined ||
            item.TREN == undefined ||
            item["UNIDAD DE PRODUCCION"] == undefined ||
            item.INICIO == undefined ||
            item.DURA == undefined ||
            item.FINALIZA == undefined
          ) {
            error++;
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[note] Acá verificamos que el codigo no tenga letras ni que sea menor que el anterior
      await Promise.all(
        sheetToJson.map(async (item: I_JobExcel) => {
          const codigoSinEspacios = item["ID-TRABAJO"].trim();
          //verificamos si tenemos el codigo
          const codigo = parseInt(item["ID-TRABAJO"], 10); // Intenta convertir el string a número

          if (!validator.isNumeric(codigoSinEspacios)) {
            errorNumber++; // Aumenta si el código no es un número válido
          } else {
            // Verifica si el código ya ha sido procesado
            if (!seenCodes.has(item["ID-TRABAJO"])) {
              // errorNumber++; // Aumenta si hay duplicado
              seenCodes.add(item["ID-TRABAJO"]);
            }

            // Verifica si el código actual no es mayor que el anterior
            if (previousCodigo !== null && codigo <= previousCodigo) {
              errorNumber++;
            }

            previousCodigo = codigo;
          }
        })
      );

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      // //[NOTE] Acá verifico si el primer elemento es 001
      const sortedCodesArray = Array.from(seenCodes)
        .map((item) => item.padStart(4, "0"))
        .sort((a, b) => parseInt(a) - parseInt(b));

      if (sortedCodesArray[0] != "0001") {
        errorNumber++;
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }
      // //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
      for (let i = 1; i < sortedCodesArray.length; i++) {
        const currentCode = parseInt(sortedCodesArray[i]);
        const previousCode = parseInt(sortedCodesArray[i - 1]);

        if (currentCode !== previousCode + 1) {
          errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
          break; // Puedes detener el ciclo en el primer error
        }
      }

      if (errorNumber > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      //[NOTE] ACÁ VERIFICAMOS SI LOS TRENES Y LAS UNIDADES DE PRODUCCIÓN EXISTEN
      await Promise.all(
        sheetToJson.map(async (item: I_JobExcel, index: number) => {
          index++;
          const trainResponse = await trainValidation.findByCodeValidation(
            item.TREN.trim(),
            projectId
          );
          if (!trainResponse.success) {
            error++;
          }
          const upResponse =
            await productionUnitValidation.findByCodeValidation(
              item["UNIDAD DE PRODUCCION"].trim(),
              projectId
            );
          if (!upResponse.success) {
            error++;
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }

      // //[SUCCESS] Guardo o actualizo la Unidad de Producción
      let code;
      let job;
      await Promise.all(
        sheetToJson.map(async (item: I_JobExcel) => {
          code = await jobValidation.findByCode(
            String(item["ID-TRABAJO"].trim()),
            responseProject.id
          );
          if (!code.success) {
            job = code.payload as Trabajo;
            await jobValidation.updateJobForExcel(
              item,
              job.id,
              responseProject.id,
              userResponse.id
            );
          } else {
            const excelEpoch = new Date(1899, 11, 30);
            const inicioDate = new Date(
              excelEpoch.getTime() + item.INICIO * 86400000
            );
            const endDate = new Date(
              excelEpoch.getTime() + item.FINALIZA * 86400000
            );
            inicioDate.setUTCHours(0, 0, 0, 0);
            endDate.setUTCHours(0, 0, 0, 0);
            const formattedDuracion = parseFloat(item.DURA).toFixed(1);
            const upResponse =
              await productionUnitValidation.findByCodeValidation(
                item["UNIDAD DE PRODUCCION"].trim(),
                projectId
              );
            const up = upResponse.payload as UnidadProduccion;
            const trainResponse = await trainValidation.findByCodeValidation(
              item.TREN.trim(),
              projectId
            );
            const train = trainResponse.payload as Tren;
            await prisma.trabajo.create({
              data: {
                codigo: String(item["ID-TRABAJO"].trim()),
                nombre: item.TRABAJOS,
                duracion: +formattedDuracion,
                fecha_inicio: inicioDate,
                fecha_finalizacion: endDate,
                nota: "",
                costo_partida: 0,
                costo_mano_obra: 0,
                costo_material: 0,
                costo_equipo: 0,
                costo_varios: 0,
                tren_id: train.id,
                estado_trabajo: E_Trabajo_Estado.PROGRAMADO,
                up_id: up.id,
                proyecto_id: responseProject.id,
                usuario_id: userResponse.id,
              },
            });
          }
        })
      );

      await prisma.$disconnect();

      return httpResponse.SuccessResponse("Trabajos creados correctamente!");
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer los Trabajos",
        error
      );
    }
  }
}

export const jobService = new JobService();

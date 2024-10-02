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
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const jobService = new JobService();

import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { trainValidation } from "@/train/train.validation";
import { productionUnitValidation } from "@/production-unit/productionUnit.validation";
import { converToDate } from "@/common/utils/date";
import { jobValidation } from "./job.validation";
import { Trabajo, Tren, UnidadProduccion, Usuario } from "@prisma/client";
import { I_CreateJobBody } from "./models/job.interface";
import { prismaJobRepository } from "./prisma-job.repository";
import { jwtService } from "@/auth/jwt.service";
import { projectValidation } from "@/project/project.validation";

class JobService {
  async createJob(
    data: I_CreateJobBody,
    token: string,
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

      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as Usuario;

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
        usuario_id: userResponse.id,
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
}

export const jobService = new JobService();

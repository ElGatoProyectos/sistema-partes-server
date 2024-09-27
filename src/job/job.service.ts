import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { trainValidation } from "@/train/train.validation";
import { productionUnitValidation } from "@/production-unit/productionUnit.validation";
import { converToDate } from "@/common/utils/date";
import { jobValidation } from "./job.validation";
import { Trabajo } from "@prisma/client";
import { I_CreateJobBody } from "./models/job.interface";
import { prismaJobRepository } from "./prisma-job.repository";

class JobService {
  async createJob(data: I_CreateJobBody): Promise<T_HttpResponse> {
    try {
      const trainResponse = await trainValidation.findById(+data.tren_id);
      if (!trainResponse) {
        return trainResponse;
      }
      const upResponse = await productionUnitValidation.findById(+data.up_id);
      if (!upResponse) {
        return upResponse;
      }
      const lastJob = await jobValidation.codeMoreHigh(data.proyecto_id);
      const lastJobResponse = lastJob.payload as Trabajo;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastJobResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(4, "0");
      const fecha_inicio = converToDate(data.fecha_inicio);
      const fecha_finalizacion = converToDate(data.fecha_finalizacion);

      const jobFormat = {
        ...data,
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
      };
      const jobResponse = await prismaJobRepository.createJob(jobFormat);
      return httpResponse.CreatedResponse(
        "Trabajo creado correctamente",
        jobResponse
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al crear Trabajo",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const jobService = new JobService();

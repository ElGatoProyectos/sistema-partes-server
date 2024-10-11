import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaJobRepository } from "./prisma-job.repository";
import { I_JobExcel } from "./models/job.interface";
import { productionUnitValidation } from "@/production-unit/productionUnit.validation";
import { Tren, UnidadProduccion } from "@prisma/client";
import { trainValidation } from "@/train/train.validation";
import { jobService } from "./job.service";

class JobValidation {
  async updateJobForExcel(
    data: I_JobExcel,
    job_id: number,
    project_id: number,
    usuario_id: number
  ): Promise<T_HttpResponse> {
    try {
      const excelEpoch = new Date(1899, 11, 30);
      const inicioDate = new Date(
        excelEpoch.getTime() + data.INICIO * 86400000
      );
      const endDate = new Date(excelEpoch.getTime() + data.FINALIZA * 86400000);
      inicioDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(0, 0, 0, 0);
      const formattedDuracion = parseFloat(data.DURA).toFixed(1);
      const upResponse = await productionUnitValidation.findByCodeValidation(
        data["UNIDAD DE PRODUCCION"].trim(),
        project_id
      );
      const up = upResponse.payload as UnidadProduccion;
      const trainResponse = await trainValidation.findByCodeValidation(
        data.TREN.trim(),
        project_id
      );
      const train = trainResponse.payload as Tren;
      const duration = jobService.calcularDiasEntreFechas(inicioDate, endDate);
      const durationFix = duration === 0 ? 1 : duration;
      const jobFormat = {
        codigo: data["ID-TRABAJO"].trim(),
        nombre: data.TRABAJOS,
        tren_id: train.id,
        up_id: up.id,
        fecha_inicio: inicioDate,
        fecha_finalizacion: endDate,
        costo_partida: 0,
        costo_mano_obra: 0,
        costo_material: 0,
        costo_equipo: 0,
        costo_varios: 0,
        proyecto_id: project_id,
        duracion: durationFix,
        usuario_id: usuario_id,
      };
      const responseJob = await prismaJobRepository.updateJobFromExcel(
        jobFormat,
        job_id
      );
      return httpResponse.SuccessResponse(
        "Trabajo modificado correctamente",
        responseJob
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Trabajo",
        error
      );
    }
  }
  async findByCode(code: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const job = await prismaJobRepository.findByCode(code, project_id);
      if (job) {
        return httpResponse.NotFoundException(
          "Codigo del Trabajo encontrado",
          job
        );
      }
      return httpResponse.SuccessResponse("Trabajo encontrado", job);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar código del Trabajo",
        error
      );
    }
  }
  async findByCodeValidation(
    code: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const job = await prismaJobRepository.findByCode(code, project_id);
      if (!job) {
        return httpResponse.NotFoundException(
          "Codigo del Trabajo encontrado",
          job
        );
      }
      return httpResponse.SuccessResponse("Trabajo encontrado", job);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar código del Trabajo",
        error
      );
    }
  }
  async findById(job_id: number): Promise<T_HttpResponse> {
    try {
      const job = await prismaJobRepository.findById(job_id);
      if (!job) {
        return httpResponse.NotFoundException("Id del Trabajo no encontrado");
      }
      return httpResponse.SuccessResponse("Trabajo encontrado", job);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Tren",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const train = await prismaJobRepository.existsName(name, project_id);
      if (train) {
        return httpResponse.NotFoundException(
          "El nombre del Trabajo ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse("Trabajo encontrado", train);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Trabajo",
        error
      );
    }
  }

  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const train = await prismaJobRepository.codeMoreHigh(project_id);
      if (!train) {
        return httpResponse.SuccessResponse("No se encontraron resultados", 0);
      }
      return httpResponse.SuccessResponse("Trabajo encontrado", train);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Tren",
        error
      );
    }
  }
}

export const jobValidation = new JobValidation();

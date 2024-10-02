import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaJobRepository } from "./prisma-job.repository";
import { I_JobExcel } from "./models/job.interface";

class JobValidation {
  async updateTrain(
    data: I_JobExcel,
    job_id: number,
    project_id: number,
    usuario_id: number
  ): Promise<T_HttpResponse> {
    try {
      const [dia, mes, anio] = data.INICIO.split("/").map(Number);
      const [dia2, mes2, anio2] = data.FINALIZA.split("/").map(Number);
      const fechaInicio = new Date(anio, mes - 1, dia);
      const fechaFin = new Date(anio2, mes2 - 1, dia2);
      const job = {
        codigo: data["ID-TRABAJO"],
        nombre: data.TRABAJOS,
        tren_id: +data.TREN,
        up_id: +data["UNIDAD-DE-PRODUCCION"],
        fecha_inicio: fechaInicio,
        fecha_finalizacion: fechaFin,
        duracion: +data.DURA,
        costo_partida: +data.COSTO,
        costo_mano_obra: +data.MO,
        costo_material: +data.MAT,
        costo_equipo: +data.EQ,
        costo_varios: +data.HE,
        proyecto_id: project_id,
        usuario_id: usuario_id,
      };
      const responseTrain = await prismaJobRepository.updateJobFromExcel(
        job,
        job_id
      );
      return httpResponse.SuccessResponse(
        "Tren modificado correctamente",
        responseTrain
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Tren",
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

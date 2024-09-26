import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaJobRepository } from "./prisma-job.repository";

class JobValidation {
  // async updateTrain(
  //   data: I_TrainExcel,
  //   idProductionUnit: number,
  //   idProjectID: number
  // ): Promise<T_HttpResponse> {
  //   try {
  //     const train = {
  //       codigo: String(data["ID-TREN"]),
  //       nombre: data.TREN,
  //       nota: data.NOTA,
  //       cuadrilla: data.TREN + "-" + data["ID-TREN"],
  //       proyecto_id: Number(idProjectID),
  //     };
  //     const responseTrain = await prismaTrainRepository.updateTrain(
  //       train,
  //       idProductionUnit
  //     );
  //     return httpResponse.SuccessResponse(
  //       "Tren modificado correctamente",
  //       responseTrain
  //     );
  //   } catch (error) {
  //     return httpResponse.InternalServerErrorException(
  //       "Error al modificar el Tren",
  //       error
  //     );
  //   }
  // }
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

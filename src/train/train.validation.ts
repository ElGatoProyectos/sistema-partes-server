import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaTrainRepository } from "./prisma-train.repository";

class TrainValidation {
  async findById(idTrain: number): Promise<T_HttpResponse> {
    try {
      const train = await prismaTrainRepository.findById(idTrain);
      if (!train) {
        return httpResponse.NotFoundException("Id del Tren no encontrado");
      }
      return httpResponse.SuccessResponse("Tren encontrado", train);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Tren",
        error
      );
    }
  }

  async codeMoreHigh(): Promise<T_HttpResponse> {
    try {
      const train = await prismaTrainRepository.codeMoreHigh();
      if (!train) {
        return httpResponse.SuccessResponse("No se encontraron resultados", []);
      }
      return httpResponse.SuccessResponse("Tren encontrado", train);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar Tren",
        error
      );
    }
  }
}

export const trainValidation = new TrainValidation();

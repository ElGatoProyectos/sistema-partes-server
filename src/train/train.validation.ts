import { I_Train, I_TrainExcel } from "./models/production-unit.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaTrainRepository } from "./prisma-train.repository";

class TrainValidation {
  async updateTrain(
    data: I_TrainExcel,
    idProductionUnit: number,
    idProjectID: number
  ): Promise<T_HttpResponse> {
    try {
      const train = {
        codigo: String(data["ID-TREN"]),
        nombre: data.TREN,
        nota: data.NOTA,
        cuadrilla: data.TREN + "-" + data["ID-TREN"],
        proyecto_id: Number(idProjectID),
      };
      const responseTrain = await prismaTrainRepository.updateTrain(
        train,
        idProductionUnit
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
  async findByCode(code: string): Promise<T_HttpResponse> {
    try {
      const train = await prismaTrainRepository.findByCode(code);
      if (train) {
        return httpResponse.NotFoundException(
          "Codigo del Tren encontrado",
          train
        );
      }
      return httpResponse.SuccessResponse("Tren encontrado", train);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar código del Tren",
        error
      );
    }
  }
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
  async findByName(name: string): Promise<T_HttpResponse> {
    try {
      const train = await prismaTrainRepository.existsName(name);
      if (train) {
        return httpResponse.NotFoundException(
          "El nombre del Tren ya existe en la base de datos"
        );
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
        "Error al buscar Tren",
        error
      );
    }
  }
}

export const trainValidation = new TrainValidation();

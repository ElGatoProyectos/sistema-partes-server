import { projectValidation } from "@/project/project.validation";
import {
  I_CreateTrainUnitBody,
  I_Cuadrilla_Train,
  I_UpdateTrainBody,
} from "./models/production-unit.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { trainValidation } from "./train.validation";
import { Tren } from "@prisma/client";
import { prismaTrainRepository } from "./prisma-train.repository";
import { TrainResponseMapper } from "./mappers/train.mapper";
import prisma from "@/config/prisma.config";
import { T_FindAll } from "@/common/models/pagination.types";

class TrainService {
  async createTrain(data: I_CreateTrainUnitBody): Promise<T_HttpResponse> {
    try {
      const resultTrain = await trainValidation.findByName(data.nombre);
      if (!resultTrain.success) {
        return resultTrain;
      }
      const resultIdProject = await projectValidation.findById(
        Number(data.proyecto_id)
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }

      const lastTrain = await trainValidation.codeMoreHigh();
      const lastTrainResponse = lastTrain.payload as Tren;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastTrainResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      const trainFormat = {
        ...data,
        cuadrilla: data.cuadrilla + "-" + formattedCodigo,
        codigo: formattedCodigo,
        operario: 1,
        oficial: 1,
        peon: 1,
        proyecto_id: Number(data.proyecto_id),
      };

      const responseTrain = await prismaTrainRepository.createTrain(
        trainFormat
      );
      const trainMapper = new TrainResponseMapper(responseTrain);
      return httpResponse.CreatedResponse(
        "Tren creado correctamente",
        trainMapper
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al crear Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateTrain(
    data: I_UpdateTrainBody,
    idTrain: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdTrain = await trainValidation.findById(idTrain);
      if (!resultIdTrain.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id del Tren que se quiere editar"
        );
      }
      const resultTrainFind = resultIdTrain.payload as Tren;
      if (resultTrainFind.nombre != data.nombre) {
        const resultTrain = await trainValidation.findByName(data.nombre);
        if (!resultTrain.success) {
          return resultTrain;
        }
      }
      const resultIdProject = await projectValidation.findById(
        Number(data.proyecto_id)
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del proyecto proporcionado"
        );
      }
      const trainResponse = resultIdTrain.payload as Tren;
      const trainFormat = {
        ...data,
        cuadrilla: data.cuadrilla + "-" + trainResponse.codigo,
        operario: data.operario,
        oficial: data.oficial,
        peon: data.peon,
        proyecto_id: Number(data.proyecto_id),
      };
      const responseTrain = await prismaTrainRepository.updateTrain(
        trainFormat,
        idTrain
      );
      const trainMapper = new TrainResponseMapper(responseTrain);
      return httpResponse.SuccessResponse(
        "Tren modificado correctamente",
        trainMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateCuadrillaTrain(data: I_Cuadrilla_Train) {
    try {
      const resultIdTrain = await trainValidation.findById(data.idTrain);
      if (!resultIdTrain.success) {
        return httpResponse.BadRequestException(
          "No se pudo encontrar el id del Tren que se quiere editar"
        );
      }
      const trainUpdate = await prismaTrainRepository.updateCuadrillaByIdTrain(
        data.idTrain,
        data.official,
        data.pawns,
        data.workers
      );
      const trainMapper = new TrainResponseMapper(trainUpdate);
      return httpResponse.SuccessResponse(
        "Cuadrilla del Tren modificada con éxito",
        trainMapper
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al editar la cuadrilla del Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(idTrain: number): Promise<T_HttpResponse> {
    try {
      const trainResponse = await prismaTrainRepository.findById(idTrain);
      if (!trainResponse) {
        return httpResponse.NotFoundException(
          "El id del Tren no fue no encontrado"
        );
      }
      return httpResponse.SuccessResponse("Tren encontrado", trainResponse);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findByName(name: string, data: T_FindAll): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaTrainRepository.searchNameTrain(
        name,
        skip,
        data.queryParams.limit
      );

      const { trains, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: trains,
      };
      return httpResponse.SuccessResponse("Éxito al buscar el Tren", formData);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAll) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const result = await prismaTrainRepository.findAll(
        skip,
        data.queryParams.limit
      );

      const { trains, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: trains,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Trenes",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusTrain(idTrain: number): Promise<T_HttpResponse> {
    try {
      const trainResponse = await trainValidation.findById(idTrain);
      if (!trainResponse.success) {
        return trainResponse;
      } else {
        const result = await prismaTrainRepository.updateStatusTrain(idTrain);
        return httpResponse.SuccessResponse(
          "Tren eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar el Tren",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const trainService = new TrainService();

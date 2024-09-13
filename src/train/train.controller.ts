import express from "@/config/express.config";
import { trainService } from "./train.service";
import {
  I_CreateTrainUnitBody,
  I_Cuadrilla_Train,
  I_UpdateTrainBody,
} from "./models/production-unit.interface";
import { T_FindAll } from "@/common/models/pagination.types";

class TrainController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateTrainUnitBody;
    const result = await trainService.createTrain(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateTrainBody;
    const idTrain = Number(request.params.id);
    const result = await trainService.updateTrain(data, idTrain);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateCuadrilla(request: express.Request, response: express.Response) {
    const data = request.body as I_Cuadrilla_Train;
    const result = await trainService.updateCuadrillaTrain(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const idTrain = Number(request.params.id);
    const result = await trainService.updateStatusTrain(idTrain);
    response.status(result.statusCode).json(result);
  }

  async findByIdTrain(request: express.Request, response: express.Response) {
    const idTrain = Number(request.params.id);
    const result = await trainService.findById(idTrain);
    response.status(result.statusCode).json(result);
  }

  async findByName(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    //si buscaba como request.body no me llegaba bien para luego buscar
    const name = request.query.name as string;
    const result = await trainService.findByName(name, paginationOptions);
    response.status(result.statusCode).json(result);
  }

  async allTrains(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await trainService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const trainController = new TrainController();

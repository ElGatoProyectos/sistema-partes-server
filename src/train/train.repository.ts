import {
  I_CreateTrainBD,
  I_UpdateTrainBody,
} from "./models/production-unit.interface";
import { T_FindAllTrain } from "./models/train.types";

export abstract class TrainRepository {
  findAll(skip: number, data: T_FindAllTrain, project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUser: number): void {}

  createTrain(data: I_CreateTrainBD): void {}

  updateCuadrillaByIdTrain(
    idTrain: number,
    workers: number,
    official: number,
    pawns: number
  ): void {}

  existsName(name: string, project_id: number): void {}

  updateTrain(data: I_UpdateTrainBody, idUser: number): void {}

  updateStatusTrain(idUser: number): void {}

  searchNameTrain(
    name: string,
    skip: number,
    limit: number,
    project_id: number
  ): void {}

  codeMoreHigh(project_id: number): void {}
}

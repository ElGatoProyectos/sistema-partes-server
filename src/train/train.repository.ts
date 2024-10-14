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

  existsName(name: string, project_id: number): void {}

  updateTrain(data: I_UpdateTrainBody, idUser: number): void {}

  updateStatusTrain(train_id: number): void {}

  codeMoreHigh(project_id: number): void {}
}

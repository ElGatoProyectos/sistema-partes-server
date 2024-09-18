import {
  I_CreateTrainBD,
  I_UpdateTrainBody,
} from "./models/production-unit.interface";

export abstract class TrainRepository {
  findAll(skip: number, limit: number): void {}

  findByCode(code: string): void {}

  findById(idUser: number): void {}

  createTrain(data: I_CreateTrainBD): void {}

  updateCuadrillaByIdTrain(
    idTrain: number,
    workers: number,
    official: number,
    pawns: number
  ): void {}

  existsName(name: string): void {}

  updateTrain(data: I_UpdateTrainBody, idUser: number): void {}

  updateStatusTrain(idUser: number): void {}

  searchNameTrain(name: string, skip: number, limit: number): void {}

  codeMoreHigh(): void {}
}

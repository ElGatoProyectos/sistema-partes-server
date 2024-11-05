import {
  I_CreateDepartureBD,
  I_UpdateDepartureBD,
} from "./models/departure.interface";
import { T_FindAllDeparture } from "./models/departure.types";

export abstract class DepartureRepository {
  findAll(skip: number, data: T_FindAllDeparture, project_id: number): void {}

  findAllWithOutPagination(project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUser: number): void {}

  createDeparture(data: I_CreateDepartureBD): void {}

  existsName(name: string, project_id: number): void {}

  updateDeparture(data: I_UpdateDepartureBD, departure_id: number): void {}

  updateStatusDeparture(departure_id: number): void {}

  codeMoreHigh(project_id: number): void {}

  isLastId(project_id: number): void {}
}

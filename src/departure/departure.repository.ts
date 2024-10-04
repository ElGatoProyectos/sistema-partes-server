import {
  I_CreateDepartureBD,
  I_UpdateDepartureBD,
} from "./models/departure.interface";
import { T_FindAllDeparture } from "./models/departure.types";

export abstract class DepartureRepository {
  findAll(skip: number, data: T_FindAllDeparture, project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUser: number): void {}

  createDeparture(data: I_CreateDepartureBD): void {}

  existsName(name: string, project_id: number): void {}

  updateDeparture(data: I_UpdateDepartureBD, job_id: number): void {}

  updateDepartureFromExcel(data: I_UpdateDepartureBD, job_id: number): void {}

  updateStatusDeparture(idUser: number): void {}

  codeMoreHigh(project_id: number): void {}
}

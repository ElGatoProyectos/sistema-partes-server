import {
  I_CreateWorkforceBD,
  I_UpdateWorkforceBody,
} from "./models/workforce.interface";
import { T_FindAllWorkforce } from "./models/workforce.types";

export abstract class WorkforceRepository {
  findAll(skip: number, data: T_FindAllWorkforce, project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findByDNI(code: string, project_id: number): void {}

  findById(idUser: number): void {}

  createWorkforce(data: I_CreateWorkforceBD): void {}

  existsName(name: string, project_id: number): void {}

  updateWorkforce(data: I_UpdateWorkforceBody, idUser: number): void {}

  updateStatusWorkforce(idUser: number): void {}

  codeMoreHigh(project_id: number): void {}
}
import { T_FindAllResource } from "./models/resource.types";
import {
  I_CreateResourcesBD,
  I_UpdateResourcesBody,
} from "./models/resources.interface";

export abstract class ResourcesRepository {
  findAll(skip: number, data: T_FindAllResource, project_id: number): void {}

  findById(bank_id: number): void {}

  findByName(name: string, project_id: number): void {}

  createResource(data: I_CreateResourcesBD): void {}

  updateResource(data: I_UpdateResourcesBody, idUser: number): void {}

  codeMoreHigh(project_id: number): void {}

  findByCode(code: string, project_id: number): void {}
}

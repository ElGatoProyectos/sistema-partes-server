import { I_CreateRolBD } from "./models/rol.interfaces";
import { T_FindAllRol } from "./models/rol.types";

export abstract class RolRepository {
  findAll(data:T_FindAllRol): void {}

  findById(idRol: number): void {}

  findByName(name: string): void {}

  createRol(data: I_CreateRolBD): void {}

  existsName(name: String): void {}
}

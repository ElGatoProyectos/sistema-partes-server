import { I_CreateRolBD } from "./models/rol.interfaces";

export abstract class RolRepository {
  findAll(): void {}

  findById(idRol: number): void {}

  findByName(name: string): void {}

  createRol(data: I_CreateRolBD): void {}

  existsName(name: String): void {}
}

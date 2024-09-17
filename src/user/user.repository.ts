import { I_CreateUserBD, I_UpdateUserBD } from "./models/user.interface";

export abstract class UserRepository {
  findAll(skip: number, limit: number, filters: string): void {}

  findById(idUser: number): void {}

  createUser(data: I_CreateUserBD): void {}

  updateUser(data: I_UpdateUserBD, idUser: number): void {}

  updateStatusUser(idUser: number): void {}

  updaterRolUser(idUser: number, idRol: number): void {}

  findByDni(dni: string): void {}

  existsEmail(dni: string): void {}

  searchNameUser(name: string, skip: number, limit: number): void {}
}

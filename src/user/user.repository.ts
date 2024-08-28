import { Usuario } from "@prisma/client";
import { I_CreateUserBD, I_UpdateUserBody } from "./models/user.interface";

export abstract class UserRepository {
  findAll(skip: number, limit: number): void {}

  findById(idUser: number): void {}

  createUser(data: I_CreateUserBD): void {}

  updateUser(data: I_UpdateUserBody, idUser: number): void {}

  updateStatusUser(idUser: number): void {}
}

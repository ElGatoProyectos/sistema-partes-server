import { Accion, Seccion } from "@prisma/client";
import {
  I_CreateUserBD,
  I_UpdateUserBD,
  IAssignUserPermissions,
} from "./models/user.interface";

export abstract class UserRepository {
  findAll(skip: number, limit: number, filters: string): void {}

  findById(user_id: number): void {}

  createUser(data: I_CreateUserBD): void {}

  updateUser(data: I_UpdateUserBD, user_id: number): void {}

  updateStatusUser(user_id: number): void {}

  updaterRolUser(user_id: number, rol_id: number): void {}

  findByDni(dni: string): void {}

  existsEmail(dni: string): void {}

  searchNameUser(name: string, skip: number, limit: number): void {}

  // assignUserPermissions(data: IAssignUserPermissions): void {}
}

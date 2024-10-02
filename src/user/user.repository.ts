import { Usuario } from "@prisma/client";
import {
  I_CreateUserBD,
  I_UpdateUser,
  I_UpdateUserBD,
  IAssignUserPermissions,
} from "./models/user.interface";

export abstract class UserRepository {
  findAll(skip: number, limit: number, filters: string, user: Usuario): void {}

  findById(user_id: number): void {}

  createUser(data: I_CreateUserBD): void {}

  updateUser(data: I_UpdateUser, user_id: number): void {}

  updateStatusUser(user_id: number): void {}

  updaterRolUser(user_id: number, rol_id: number): void {}

  getUsersForCompany(
    skip: number,
    limit: number,
    name: string,
    user_id: number
  ): void {}

  findByDni(dni: string): void {}

  existsEmail(dni: string): void {}

  searchNameUser(name: string, skip: number, limit: number): void {}

  assignUserPermissions(data: IAssignUserPermissions): void {}
}

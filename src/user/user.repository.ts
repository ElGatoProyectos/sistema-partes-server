import { E_Estado_BD, Rol, Usuario } from "@prisma/client";
import {
  I_CreateUserBD,
  I_UpdateUser,
  I_UpdateUserBD,
  IAssignUserPermissions,
} from "./models/user.interface";
import { T_FindAllUser } from "./models/user.types";

export abstract class UserRepository {
  findAll(skip: number, limit: number, filters: string, user: Usuario): void {}

  findById(user_id: number): void {}

  findByIdValidation(user_id: number): void {}

  createUser(data: I_CreateUserBD): void {}

  updateUser(data: I_UpdateUser, user_id: number): void {}

  updateStatusUser(user_id: number): void {}

  updateRolUser(user_id: number, rol_id: number): void {}

  updateManyStatus(
    ids: number[],estado : E_Estado_BD,
  ): void {}

  getUsersForCompany(
    skip: number,
    data: T_FindAllUser,
    rol: Rol,
    user_id: number,
    userResponse: Usuario
  ): void {}

  findByDni(dni: string): void {}

  findManyId(ids: number[]): void {}

  existsEmail(dni: string): void {}

  assignUserPermissions(data: IAssignUserPermissions): void {}
}

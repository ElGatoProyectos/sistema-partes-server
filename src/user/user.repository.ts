import { Usuario } from "@prisma/client";
import { I_CreateUserBD } from "./models/user.interface";

export abstract class UserRepository {
  findAll(): void {}

  findOne(): void {}

  createUser(data: I_CreateUserBD): void {}
}

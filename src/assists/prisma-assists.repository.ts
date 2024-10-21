import prisma from "@/config/prisma.config";
import { BankWorkforceRepository } from "./assists.repository";
import {
  I_CreateAssistsWorkforceBD,
  I_UpdateAssitsBD,
} from "./models/assists.interface";
import { T_FindAllAssists } from "./models/assists.types";
import { Asistencia } from "@prisma/client";

class PrismaAssistsRepository implements BankWorkforceRepository {
  async createAssists(data: I_CreateAssistsWorkforceBD): Promise<Asistencia> {
    const asssists = await prisma.asistencia.create({
      data,
    });
    return asssists;
  }

  updateAssists(bank_id: number, data: I_UpdateAssitsBD): void {
    throw new Error("Method not implemented.");
  }
  updateStatusAssists(bank_id: number): void {
    throw new Error("Method not implemented.");
  }
  findAll(skip: number, data: T_FindAllAssists, project_id: number): void {
    throw new Error("Method not implemented.");
  }
  findById(assists_id: number): void {
    throw new Error("Method not implemented.");
  }
}

export const prismaAssistsRepository = new PrismaAssistsRepository();

import prisma from "@/config/prisma.config";
import { BankWorkforceRepository } from "./assists.repository";
import {
  I_AssistsWorkforce,
  I_CreateAssistsWorkforceBD,
  I_UpdateAssitsBD,
} from "./models/assists.interface";
import { T_FindAllAssists } from "./models/assists.types";
import { Asistencia, E_Estado_BD } from "@prisma/client";

class PrismaAssistsRepository implements BankWorkforceRepository {
  async createAssists(data: I_CreateAssistsWorkforceBD): Promise<Asistencia> {
    const asssists = await prisma.asistencia.create({
      data,
    });
    return asssists;
  }

  async updateAssists(
    assists_id: number,
    data: I_UpdateAssitsBD
  ): Promise<Asistencia> {
    const assists = await prisma.asistencia.update({
      where: {
        id: assists_id,
      },
      data: data,
    });
    return assists;
  }
  updateStatusAssists(bank_id: number): void {
    throw new Error("Method not implemented.");
  }
  findAll(skip: number, data: T_FindAllAssists, project_id: number): void {
    throw new Error("Method not implemented.");
  }
  async findById(assists_id: number): Promise<I_AssistsWorkforce | null> {
    const assists = await prisma.asistencia.findFirst({
      where: {
        id: assists_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return assists;
  }
}

export const prismaAssistsRepository = new PrismaAssistsRepository();

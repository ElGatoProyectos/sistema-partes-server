import prisma from "../config/prisma.config";
import { Banco, E_Estado_BD } from "@prisma/client";
import {
  I_Bank,
  I_BankWorkforce,
  I_CreateBankWorkforceBD,
  I_UpdateBankBD,
} from "./models/bankWorkforce.interface";
import { BankWorkforceRepository } from "./bankWorkforce.repository";
import { T_FindAllBank } from "./models/bankWorkforce.types";

class PrismaBankWorkforceRepository implements BankWorkforceRepository {
  async createBankWorkforce(data: I_CreateBankWorkforceBD): Promise<Banco> {
    const bank = await prisma.banco.create({
      data,
    });
    return bank;
  }
  async createBankWorkforceMasive(
    data: I_CreateBankWorkforceBD[]
  ): Promise<{ count: number }> {
    const bank = await prisma.banco.createMany({
      data,
    });
    return bank;
  }

  async updateBankWorkforce(
    bank_id: number,
    data: I_UpdateBankBD
  ): Promise<Banco> {
    const bank = await prisma.banco.update({
      where: {
        id: bank_id,
      },
      data: data,
    });
    return bank;
  }

  async updateStatusBankWorkforce(bank_id: number): Promise<Banco> {
    const bankResponse = await prisma.banco.update({
      where: {
        id: bank_id,
      },
      data: {
        eliminado: E_Estado_BD.y,
      },
    });
    return bankResponse;
  }

  async findByName(name: string, project_id: number): Promise<Banco | null> {
    const bank = await prisma.banco.findFirst({
      where: {
        nombre: {
          contains: name,
        },
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return bank;
  }
  async existsName(name: string): Promise<Banco | null> {
    const bankResponse = await prisma.banco.findFirst({
      where: {
        nombre: name,
        eliminado: E_Estado_BD.n,
      },
    });
    return bankResponse;
  }

  async findAll(
    skip: number,
    data: T_FindAllBank,
    project_id: number
  ): Promise<{ banks: I_Bank[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      filters.nombre = {
        contains: data.queryParams.search,
      };
    }
    const [banks, total]: [I_Bank[], number] = await prisma.$transaction([
      prisma.banco.findMany({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
        skip,
        take: data.queryParams.limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.banco.count({
        where: {
          ...filters,
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { banks, total };
  }
  async findById(bank_id: number): Promise<I_BankWorkforce | null> {
    const bank = await prisma.banco.findFirst({
      where: {
        id: bank_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return bank;
  }
}

export const prismaBankWorkforceRepository =
  new PrismaBankWorkforceRepository();

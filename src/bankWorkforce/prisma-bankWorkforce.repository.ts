import prisma from "@/config/prisma.config";
import { Banco, E_Estado_BD } from "@prisma/client";
import {
  I_BankWorkforce,
  I_CreateBankWorkforceBD,
} from "./models/bankWorkforce.interface";
import { BankWorkforceRepository } from "./bankWorkforce.repository";

class PrismaBankWorkforceRepository implements BankWorkforceRepository {
  async createBankWorkforceMasive(
    data: I_CreateBankWorkforceBD[]
  ): Promise<{ count: number }> {
    const bank = await prisma.banco.createMany({
      data,
    });
    return bank;
  }
  async findByName(name: string): Promise<Banco | null> {
    const bank = await prisma.banco.findFirst({
      where: {
        nombre: name,
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

  async createBankWorkforce(data: I_CreateBankWorkforceBD): Promise<Banco> {
    const bank = await prisma.banco.create({
      data,
    });
    return bank;
  }
  async findAll(): Promise<Banco[]> {
    const banks = await prisma.banco.findMany({
      where: {
        eliminado: E_Estado_BD.n,
      },
    });
    return banks;
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

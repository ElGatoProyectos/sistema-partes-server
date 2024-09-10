import { E_Estado_BD, Empresa } from "@prisma/client";
import { CompanyRepository } from "./company.repository";
import {
  I_Company,
  I_CreateCompanyBD,
  I_UpdateCompanyBody,
} from "./models/company.interface";
import prisma from "@/config/prisma.config";

class PrismaCompanyRepository implements CompanyRepository {
  async findCompanyByUser(idUser: number): Promise<Empresa | null> {
    const companyByUser = await prisma.empresa.findFirst({
      where: {
        usuario_id: idUser,
      },
    });
    return companyByUser;
  }
  async existsName(name: string): Promise<Empresa | null> {
    const company = await prisma.empresa.findFirst({
      where: {
        nombre_empresa: name,
        eliminado: E_Estado_BD.n,
      },
    });
    return company;
  }
  async findAll(
    skip: number,
    limit: number
  ): Promise<{ companies: I_Company[]; total: number } | null> {
    const [companies, total]: [I_Company[], number] = await prisma.$transaction(
      [
        prisma.empresa.findMany({
          where: {
            eliminado: E_Estado_BD.n,
          },
          skip,
          take: limit,
          omit: {
            eliminado: true,
          },
        }),
        prisma.empresa.count({
          where: {
            eliminado: E_Estado_BD.n,
          },
        }),
      ]
    );
    return { companies, total };
  }
  async findById(idCompany: number): Promise<Empresa | null> {
    const company = await prisma.empresa.findFirst({
      where: {
        id: idCompany,
      },
    });
    return company;
  }

  async createCompany(data: I_CreateCompanyBD): Promise<Empresa> {
    const company = await prisma.empresa.create({
      data,
    });
    return company;
  }

  async updateCompany(
    data: I_UpdateCompanyBody,
    idCompany: number
  ): Promise<Empresa> {
    const company = await prisma.empresa.update({
      where: { id: idCompany },
      data: data,
    });
    return company;
  }

  async updateStatusCompany(idCompany: number): Promise<Empresa> {
    const company = await prisma.empresa.findFirst({
      where: {
        id: idCompany,
      },
    });

    const newStateCompany =
      company?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;

    const companyUpdate = await prisma.empresa.update({
      where: { id: idCompany },
      data: {
        eliminado: newStateCompany,
      },
    });
    return companyUpdate;
  }

  async searchNameCompany(
    name: string,
    skip: number,
    limit: number
  ): Promise<{ companies: I_Company[]; total: number } | null> {
    const [companies, total]: [I_Company[], number] = await prisma.$transaction(
      [
        prisma.empresa.findMany({
          where: {
            nombre_empresa: {
              contains: name,
            },
            eliminado: E_Estado_BD.n,
          },
          skip,
          take: limit,
          omit: {
            eliminado: true,
          },
        }),
        prisma.empresa.count({
          where: {
            nombre_empresa: {
              contains: name,
            },
            eliminado: E_Estado_BD.n,
          },
        }),
      ]
    );
    return { companies, total };
  }
}

export const prismaCompanyRepository = new PrismaCompanyRepository();

import prisma from "../config/prisma.config";
import { CompanyRepository } from "./detail-user-company.repository";
import { DetalleUsuarioEmpresa } from "@prisma/client";

class PrismaDetailUserCompanyRepository implements CompanyRepository {
  async findByIdUser(user_id: number): Promise<DetalleUsuarioEmpresa | null> {
    const detail = await prisma.detalleUsuarioEmpresa.findFirst({
      where: {
        usuario_id: user_id,
      },
    });
    return detail;
  }
  async countUsersForCompany(company_id: number): Promise<Number> {
    const usersCompany = await prisma.detalleUsuarioEmpresa.count({
      where: {
        empresa_id: company_id,
      },
    });
    return usersCompany;
  }
  async findByIdCompany(
    company_id: number
  ): Promise<DetalleUsuarioEmpresa | null> {
    const detail = await prisma.detalleUsuarioEmpresa.findFirst({
      where: {
        empresa_id: company_id,
      },
    });
    return detail;
  }
  async createCompany(
    idUser: number,
    idCompany: number
  ): Promise<DetalleUsuarioEmpresa | null> {
    const detailUserCompany = await prisma.detalleUsuarioEmpresa.create({
      data: {
        usuario_id: idUser,
        empresa_id: idCompany,
      },
    });
    return detailUserCompany;
  }
}

export const prismaDetailUserCompanyRepository =
  new PrismaDetailUserCompanyRepository();

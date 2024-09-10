import prisma from "@/config/prisma.config";
import { CompanyRepository } from "./detail-user-company.repository";
import { DetalleUsuarioEmpresa } from "@prisma/client";

class PrismaDetailUserCompanyRepository implements CompanyRepository {
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

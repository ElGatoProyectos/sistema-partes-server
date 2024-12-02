import prisma from "../config/prisma.config";
import { CompanyRepository } from "./detail-user-company.repository";
import { DetalleUsuarioEmpresa } from "@prisma/client";
import { T_FindAllDetailUserCompany } from "./models/detailsUserCompany.types";
import { I_DetalleUsuarioEmpresa } from "./models/detailsUserCompany.interface";

class PrismaDetailUserCompanyRepository implements CompanyRepository {
  async findAllByIdCompanyWithOutPagination(company_id: number): Promise<DetalleUsuarioEmpresa[] | null> {
    const details= await prisma.detalleUsuarioEmpresa.findMany({
      where:{
        empresa_id:company_id
      }
    })
    return details
  }
  async getAllUsersOfProjectUnassigned(
    skip: number,
    data: T_FindAllDetailUserCompany,
    company_id: number
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let users: any = [];
    let total: any;
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }
    [users, total] = await prisma.$transaction([
      prisma.detalleUsuarioEmpresa.findMany({
        where: {
          empresa_id: company_id,
          Usuario: {
            ...filters,
            Rol: {
              rol: "NO_ASIGNADO",
            },
          },
        },
        include: {
          Usuario: {
            include: {
              Rol: true,
            },
          },
        },
        skip,
        take: data.queryParams.limit,
      }),
      prisma.detalleUsuarioEmpresa.count({
        where: {
          empresa_id: company_id,
          Usuario: {
            ...filters,
          },
        },
      }),
    ]);
    const userAll = users.map((item: I_DetalleUsuarioEmpresa) => {
      const { Usuario, ...company } = item;
      const { Rol, ...user } = Usuario;
      return {
        usuario: user,
        rol: Rol,
      };
    });
    return { userAll, total };
  }
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

import { rolValidation } from "../rol/rol.validation";
import prisma from "../config/prisma.config";
import {
  I_CreateUserBD,
  I_Detalles,
  I_UpdateUser,
  I_User,
  IAssignUserPermissions,
} from "./models/user.interface";
import { UserRepository } from "./user.repository";
import { DetalleUsuarioEmpresa, E_Estado_BD, Empresa, Rol, Usuario } from "@prisma/client";
import { companyValidation } from "../company/company.validation";
import { I_Empresa } from "../company/models/company.interface";
import { T_FindAllUser } from "./models/user.types";

class PrismaUserRepository implements UserRepository {
  async findEmailAndCompanyInDetailCompany(email: string, company: number): Promise<DetalleUsuarioEmpresa | null> {
    const detail= await prisma.detalleUsuarioEmpresa.findFirst({
      where:{
        Usuario:{
          email:email
        },
        empresa_id:company
      }
    })
    return detail
  }
  async findDniAndCompanyInDetailCompany(dni: string, company_id: number): Promise<DetalleUsuarioEmpresa | null> {
    const detail= await prisma.detalleUsuarioEmpresa.findFirst({
      where:{
        Usuario:{
          dni:dni
        },
        empresa_id:company_id
      }
    })
    return detail
  }
  
  async findManyId(ids: number[]): Promise<Usuario[]> {
    const users = await prisma.usuario.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return users;
  }
  async getUsersForCompany(
    skip: number,
    data: T_FindAllUser,
    rol: Rol,
    company_id: number,
    userResponse: Usuario
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let users: any = [];
    let total: any;
    if (data.queryParams.name) {
      filters.nombre_completo = {
        contains: data.queryParams.name,
      };
    }
    if (data.queryParams.estado) {
      if (data.queryParams.estado === E_Estado_BD.y) {
        filters.estado = E_Estado_BD.y;
      } else {
        filters.estado = E_Estado_BD.n;
      }
    }
    if (rol) {
      filters.rol_id = rol.id;
    }
    [users, total] = await prisma.$transaction([
      prisma.detalleUsuarioEmpresa.findMany({
        where: {
          empresa_id: company_id,
          Usuario: {
            ...filters,
          },
        },
        include: {
          Usuario: {
            include: {
              Rol: true,
            },
          },
          Empresa: true,
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
    const userAll = users.map((item: I_Detalles) => {
      const { Usuario, ...company } = item;
      const { Empresa } = item;
      const { Rol, ...user } = Usuario;
      return {
        empresa: Empresa,
        usuario: user,
        rol: Rol,
      };
    });
    return { userAll, total };
  }
  async assignUserPermissions(data: IAssignUserPermissions) {
    const resultDetailUserProject = await prisma.detalleUsuarioProyecto.create({
      data: {
        usuario_id: data.user_id,
        projecto_id: data.project_id,
      },
    });
    let permisos = [];
    for (let i = 0; i < data.actions.length; i++) {
      const permiso = await prisma.permisos.create({
        data: {
          seccion_id: +data.section.id,
          accion_id: data.actions[i].id,
          rol_id: data.rol_id,
        },
      });
      permisos.push(permiso);
    }

    return {
      detalleUsuarioProyecto: resultDetailUserProject,
      permisos,
    };
  }

  async updateRolUser(idUser: number, idRol: number): Promise<Usuario> {
    const user = await prisma.usuario.update({
      where: {
        id: idUser,
      },
      data: {
        rol_id: idRol,
      },
    });
    return user;
  }
  async existsEmail(email: string): Promise<Usuario | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        email,
      },
    });
    return user;
  }

  async findByDni(dni: string): Promise<Usuario | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        dni,
      },
    });
    return user;
  }
  async updateStatusUser(idUser: number): Promise<Usuario> {
    const user = await prisma.usuario.findFirst({
      where: {
        id: idUser,
      },
    });

    const newStateUser =
      user?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const userUpdate = await prisma.usuario.update({
      where: { id: idUser },
      data: {
        eliminado: newStateUser,
      },
    });
    return userUpdate;
  }
  async updateUser(data: I_UpdateUser, idUser: number): Promise<Usuario> {
    const user = await prisma.usuario.update({
      where: { id: idUser },
      data,
    });

    return user;
  }

  async createUser(data: I_CreateUserBD): Promise<Usuario> {
    const user = await prisma.usuario.create({
      data,
    });
    return user;
  }
  async findAll(
    skip: number,
    limit: number,
    name: string,
    user: Usuario
  ): Promise<{ userAll: any[]; total: number }> {
    let filters: any = {};
    let users: any = [];
    let total: any;
    let userAll: any = [];
    if (name) {
      filters.nombre_completo = {
        contains: name,
      };
    }
    const rolResponse = await rolValidation.findById(user.rol_id);
    const rolFind = rolResponse.payload as Rol;
    if (rolFind.rol === "ADMIN") {
      [users, total] = await prisma.$transaction([
        prisma.empresa.findMany({
          where: {
            Usuario: {
              ...filters,
              Rol: {
                rol: {
                  not: "ADMIN",
                },
              },
            },
          },

          //     where: {
          //       ...filters,
          //       Rol: {
          //         rol: {
          //           not: "ADMIN",
          //         },
          //       },
          //     },
          include: {
            Usuario: {
              include: {
                Rol: true,
              },
              omit: {
                contrasena: true,
              },
            }, // Esto incluirá la relación completa de usuarios
          },
          skip,
          take: limit,
        }),
        prisma.empresa.count({
          where: {
            Usuario: {
              ...filters,
              Rol: {
                rol: {
                  not: "ADMIN",
                },
              },
            },
          },
        }),
      ]);
      userAll = users.map((item: I_Empresa) => {
        const { Usuario, ...company } = item;
        const { Rol, ...user } = Usuario;
        return {
          empresa: company,
          usuario: user,
          rol: Rol,
        };
      });
    }
    if (rolFind.rol === "USER") {
      const companyResponse = await companyValidation.findByIdUser(user.id);
      const company = companyResponse.payload as Empresa;
      [users, total] = await prisma.$transaction([
        prisma.detalleUsuarioEmpresa.findMany({
          where: {
            empresa_id: company.id,
            Usuario: {
              ...filters,
            },
          },
          include: {
            Usuario: {
              include: {
                Rol: true,
              },
            },
            Empresa: true,
          },
          skip,
          take: limit,
        }),
        prisma.detalleUsuarioEmpresa.count({
          where: {
            empresa_id: company.id,
          },
        }),
      ]);
      userAll = users.map((item: I_Detalles) => {
        const { Usuario, ...company } = item;
        const { Rol, ...user } = Usuario;
        return {
          empresa: company,
          usuario: user,
          rol: Rol,
        };
      });
    }
    return { userAll, total };
  }

  async findById(idUser: number): Promise<I_User | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        id: idUser,
      },
      include: {
        Rol: true,
      },
      omit: {
        contrasena: true,
        eliminado: true,
      },
    });
    return user;
  }
  async findByIdValidation(idUser: number): Promise<I_User | null> {
    const user = await prisma.usuario.findFirst({
      where: {
        id: idUser,
      },
      include: {
        Rol: true,
      },
    });
    return user;
  }
}

export const prismaUserRepository = new PrismaUserRepository();

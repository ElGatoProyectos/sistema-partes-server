import { E_Estado_BD, E_Estado_MO_BD, ManoObra } from "@prisma/client";
import { WorkforceRepository } from "./workforce.repository";
import prisma from "../config/prisma.config";
import {
  I_CreateWorkforceBD,
  I_UpdateWorkforceBodyValidation,
  I_Workforce,
} from "./models/workforce.interface";
import { T_FindAllWorkforce } from "./models/workforce.types";

class PrismaWorkforceRepository implements WorkforceRepository {
  async findManyId(ids: number[], project_id: number): Promise<ManoObra[]> {
    const workforces = await prisma.manoObra.findMany({
      where: {
        id: {
          in: ids,
        },
        proyecto_id: project_id,
      },
    });
    return workforces;
  }

  async createWorkforce(data: I_CreateWorkforceBD): Promise<ManoObra> {
    const workforce = await prisma.manoObra.create({
      data,
    });
    return workforce;
  }
  async updateWorkforce(
    data: I_UpdateWorkforceBodyValidation,
    workforce_id: number
  ): Promise<ManoObra> {
    const workforce = await prisma.manoObra.update({
      where: { id: workforce_id },
      data: data,
    });
    return workforce;
  }
  async changeStateWorkforce(workforce_id: number): Promise<ManoObra> {
    const workforce = await prisma.manoObra.update({
      where: { id: workforce_id },
      data: {
        estado: E_Estado_MO_BD.ACTIVO,
        fecha_cese: null,
      },
    });
    return workforce;
  }
  async findAll(
    skip: number,
    data: T_FindAllWorkforce,
    project_id: number
  ): Promise<{ workforces: I_Workforce[]; total: number }> {
    let filters: any = {};
    let filtersCategory = this.getCategoryFilter(data.queryParams.category);
    let filtersOrigin = this.getOriginFilter(data.queryParams.origin);
    let filtersSpecialty = this.getSpecialityFilter(data.queryParams.specialty);
    let filtersType = this.getTypeFilter(data.queryParams.type);
    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filters.OR = [
          {
            nombre_completo: {
              contains: data.queryParams.search,
            },
          },
          {
            apellido_materno: {
              contains: data.queryParams.search,
            },
          },
          {
            apellido_paterno: {
              contains: data.queryParams.search,
            },
          },
        ];
      } else {
        filters.documento_identidad = {
          contains: data.queryParams.search,
        };
      }
    }

    if (data.queryParams.state) {
      if (data.queryParams.state.toUpperCase() == E_Estado_MO_BD.ACTIVO) {
        filters.estado = E_Estado_MO_BD.ACTIVO;
      }
      if (data.queryParams.state.toUpperCase() == E_Estado_MO_BD.INACTIVO) {
        filters.estado = E_Estado_MO_BD.INACTIVO;
      }
    }

    const [workforces, total]: [I_Workforce[], number] =
      await prisma.$transaction([
        prisma.manoObra.findMany({
          where: {
            ...filters,
            CategoriaObrero: {
              ...filtersCategory,
            },
            OrigenObrero: {
              ...filtersOrigin,
            },
            EspecialidadObra: {
              ...filtersSpecialty,
            },
            TipoObrero: {
              ...filtersType,
            },
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
          include: {
            EspecialidadObra: true,
            OrigenObrero: true,
            TipoObrero: true,
            CategoriaObrero: true,
            Unidad: true,
          },
          skip,
          take: data.queryParams.limit,
          omit: {
            eliminado: true,
          },
          orderBy: {
            codigo: "asc",
          },
        }),
        prisma.manoObra.count({
          where: {
            ...filters,
            CategoriaObrero: {
              ...filtersCategory,
            },
            OrigenObrero: {
              ...filtersOrigin,
            },
            EspecialidadObra: {
              ...filtersSpecialty,
            },
            TipoObrero: {
              ...filtersType,
            },
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { workforces, total };
  }
  async findAllWithoutPaginationForProject(
    project_id: number
  ): Promise<ManoObra[] | null> {
    const workforces = await prisma.manoObra.findMany({
      where: {
        eliminado: E_Estado_BD.n,
        estado: "ACTIVO",
        proyecto_id: project_id,
      },
    });
    return workforces;
  }
  async findAllWithoutPagination(): Promise<ManoObra[] | null> {
    const workforces = await prisma.manoObra.findMany({
      where: {
        eliminado: E_Estado_BD.n,
        estado: "ACTIVO",
      },
    });
    return workforces;
  }

  async findAllByDate(
    date: Date,
    project_id: number
  ): Promise<ManoObra[] | null> {
    const fechaInicio = new Date(date.setHours(0, 0, 0, 0)); // inicio del día
    const fechaFin = new Date(date.setHours(23, 59, 59, 999)); // fin del día
    //[note] coloque el none xq busca mano de obra donde no seaa el date que paso
    const empleadosSinAsistencia = await prisma.manoObra.findMany({
      where: {
        proyecto_id: project_id,
        eliminado: "n",
        estado: "ACTIVO",
        Asistencia: {
          none: {
            fecha: {
              gte: fechaInicio,
              lte: fechaFin,
            },
          },
        },
      },
    });
    return empleadosSinAsistencia;
  }
  getCategoryFilter(category: string | undefined) {
    if (!category) return {};
    return { nombre: { contains: category } };
  }
  getSpecialityFilter(speciality: string | undefined) {
    if (!speciality) return {};
    return { nombre: { contains: speciality } };
  }
  getTypeFilter(type: string | undefined) {
    if (!type) return {};
    return { nombre: { contains: type } };
  }
  getOriginFilter(origin: string | undefined) {
    if (!origin) return {};
    return { nombre: { contains: origin } };
  }

  async findById(workforce_id: number): Promise<I_Workforce | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        id: workforce_id,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return workforce;
  }

  async updateStatusWorkforce(workforce_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        id: workforce_id,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateTrain =
      workforce?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const trainUpdate = await prisma.manoObra.update({
      where: { id: workforce_id },
      data: {
        eliminado: newStateTrain,
      },
    });
    return trainUpdate;
  }
  async findByIdSpecialty(specialty_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        especialidad_obrero_id: specialty_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async findByIdBank(bank_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        banco_id: bank_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async findByIdCategoryWorkforce(
    category_workforce_id: number
  ): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        categoria_obrero_id: category_workforce_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async findByIdOrigin(origin_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        origen_obrero_id: origin_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async findByIdType(type_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        tipo_obrero_id: type_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async findByCode(code: string, project_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        codigo: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async findByDNI(dni: string, project_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        documento_identidad: dni,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return workforce;
  }
  async existsName(name: string, project_id: number): Promise<ManoObra | null> {
    const workforce = await prisma.manoObra.findFirst({
      where: {
        nombre_completo: name,
        proyecto_id: project_id,
      },
    });
    return workforce;
  }

  async codeMoreHigh(project_id: number): Promise<ManoObra | null> {
    const lastWorkforce = await prisma.manoObra.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastWorkforce;
  }
}

export const prismaWorkforceRepository = new PrismaWorkforceRepository();

import { E_Estado_BD, UnidadProduccion } from "@prisma/client";
import {
  I_CreateProductionUnitBD,
  I_ProductionUnit,
  I_UpdateProductionUnitBody,
  I_UpdateProductionUnitBodyValidation,
} from "./models/production-unit.interface";
import { ProudctionUnitRepository } from "./production-unit.repository";
import prisma from "@/config/prisma.config";
import { T_FindAllUp } from "./models/up.types";

class PrimsaProductionUnitRepository implements ProudctionUnitRepository {
  async findByCode(
    code: string,
    project_id: number
  ): Promise<UnidadProduccion | null> {
    const productionUnit = await prisma.unidadProduccion.findFirst({
      where: {
        codigo: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return productionUnit;
  }

  async existsName(name: string): Promise<UnidadProduccion | null> {
    const productionUnit = await prisma.unidadProduccion.findFirst({
      where: {
        nombre: name,
        eliminado: E_Estado_BD.n,
      },
    });
    return productionUnit;
  }
  async codeMoreHigh(project_id: number): Promise<UnidadProduccion | null> {
    const lastProductionUnit = await prisma.unidadProduccion.findFirst({
      where: {
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
      orderBy: { codigo: "desc" },
    });
    return lastProductionUnit;
  }
  async createProductionUnit(
    data: I_CreateProductionUnitBD
  ): Promise<UnidadProduccion> {
    const productionUnit = await prisma.unidadProduccion.create({
      data,
    });
    return productionUnit;
  }
  async updateProductionUnit(
    data: I_UpdateProductionUnitBodyValidation,
    idProductionUnit: number
  ): Promise<UnidadProduccion> {
    const productionUnit = await prisma.unidadProduccion.update({
      where: { id: idProductionUnit },
      data: data,
    });
    return productionUnit;
  }

  async searchNameProductionUnit(
    name: string,
    skip: number,
    limit: number
  ): Promise<{ productionUnits: I_ProductionUnit[]; total: number }> {
    const [productionUnits, total]: [I_ProductionUnit[], number] =
      await prisma.$transaction([
        prisma.unidadProduccion.findMany({
          where: {
            nombre: {
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
        prisma.unidadProduccion.count({
          where: {
            nombre: {
              contains: name,
            },
            eliminado: E_Estado_BD.n,
          },
        }),
      ]);
    return { productionUnits, total };
  }

  async findAllPagination(
    skip: number,
    data: T_FindAllUp,
    project_id: number
  ): Promise<{ productionUnits: I_ProductionUnit[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filters.nombre = {
          contains: data.queryParams.search,
        };
      } else {
        filters.codigo = {
          contains: data.queryParams.search,
        };
      }
    }

    const [productionUnits, total]: [I_ProductionUnit[], number] =
      await prisma.$transaction([
        prisma.unidadProduccion.findMany({
          where: {
            ...filters,
            proyecto_id: project_id,
            eliminado: E_Estado_BD.n,
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
        prisma.unidadProduccion.count({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
          },
        }),
      ]);
    return { productionUnits, total };
  }

  async findById(idProductionUnit: number): Promise<I_ProductionUnit | null> {
    const productionUnit = await prisma.unidadProduccion.findFirst({
      where: {
        id: idProductionUnit,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return productionUnit;
  }

  async updateStatusProductionUnit(
    idProductionUnit: number
  ): Promise<UnidadProduccion | null> {
    const productionUnit = await prisma.unidadProduccion.findFirst({
      where: {
        id: idProductionUnit,
      },
    });

    const newStateProductionUnit =
      productionUnit?.eliminado == E_Estado_BD.y
        ? E_Estado_BD.n
        : E_Estado_BD.y;
    const productionUnitUpdate = await prisma.unidadProduccion.update({
      where: { id: idProductionUnit },
      data: {
        eliminado: newStateProductionUnit,
      },
    });
    return productionUnitUpdate;
  }

  async isLastId(project_id: number): Promise<UnidadProduccion | null> {
    const job = await prisma.unidadProduccion.findFirst({
      where: {
        proyecto_id: project_id,
      },
      orderBy: {
        codigo: "desc",
      },
    });
    return job;
  }
}

export const prismaProductionUnitRepository =
  new PrimsaProductionUnitRepository();

import { E_Estado_BD, UnidadProduccion } from "@prisma/client";
import {
  I_CreateProductionUnitBD,
  I_ProductionUnit,
  I_UpdateProductionUnitBody,
} from "./models/production-unit.interface";
import { ProudctionUnitRepository } from "./production-unit.repository";
import prisma from "@/config/prisma.config";

class PrimsaProductionUnitRepository implements ProudctionUnitRepository {
  async createProductionUnit(
    data: I_CreateProductionUnitBD
  ): Promise<UnidadProduccion> {
    const productionUnit = await prisma.unidadProduccion.create({
      data,
    });
    return productionUnit;
  }
  async updateProductionUnit(
    data: I_UpdateProductionUnitBody,
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
  ): Promise<{ productionUnits: I_ProductionUnit[]; total: number } | null> {
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

  async findAll(
    skip: number,
    limit: number
  ): Promise<{ productionUnits: I_ProductionUnit[]; total: number } | null> {
    const [productionUnits, total]: [I_ProductionUnit[], number] =
      await prisma.$transaction([
        prisma.unidadProduccion.findMany({
          where: {
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
}

export const prismaProductionUnitRepository =
  new PrimsaProductionUnitRepository();

import prisma from "@/config/prisma.config";
import {
  I_CreateUnitBD,
  I_Unit,
  I_UpdateUnitBody,
} from "./models/unit.interface";
import { E_Estado_BD, Unidad } from "@prisma/client";
import { UnitRepository } from "./unit.repository";

class PrismaUnitRepository implements UnitRepository {
  async codeMoreHigh(): Promise<Unidad | null> {
    const lastUnit = await prisma.unidad.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
      },
      orderBy: { codigo: "desc" },
    });
    return lastUnit;
  }
  async existsSymbol(symbol: string): Promise<Unidad | null> {
    const unit = await prisma.unidad.findFirst({
      where: {
        simbolo: symbol,
        eliminado: E_Estado_BD.n,
      },
    });
    return unit;
  }
  // async existsName(name: string): Promise<Unidad | null> {
  //   const resourseCategory = await prisma.unidad.findFirst({
  //     where: {
  //       nombre: name,
  //       eliminado: E_Estado_BD.n,
  //     },
  //   });
  //   return resourseCategory;
  // }
  async searchNameUnit(
    name: string,
    skip: number,
    limit: number
  ): Promise<{
    units: I_Unit[];
    total: number;
  }> {
    const [units, total]: [I_Unit[], number] = await prisma.$transaction([
      prisma.unidad.findMany({
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
      prisma.unidad.count({
        where: {
          nombre: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
        },
      }),
    ]);
    return { units, total };
  }

  async findAll(
    skip: number,
    limit: number
  ): Promise<{
    units: I_Unit[];
    total: number;
  }> {
    const [units, total]: [I_Unit[], number] = await prisma.$transaction([
      prisma.unidad.findMany({
        where: {
          eliminado: E_Estado_BD.n,
        },
        skip,
        take: limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.unidad.count({
        where: {
          eliminado: E_Estado_BD.n,
        },
      }),
    ]);
    return { units, total };
  }

  async findById(idUnit: number): Promise<I_Unit | null> {
    const unit = await prisma.unidad.findFirst({
      where: {
        id: idUnit,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return unit;
  }

  async existsName(name: string): Promise<Unidad | null> {
    const resourseCategory = await prisma.unidad.findFirst({
      where: {
        nombre: name,
        eliminado: E_Estado_BD.n,
      },
    });
    return resourseCategory;
  }

  async createUnit(data: I_CreateUnitBD): Promise<Unidad> {
    const unit = await prisma.unidad.create({
      data,
    });
    return unit;
  }

  async updateUnit(data: I_UpdateUnitBody, idUnit: number): Promise<Unidad> {
    const unidad = await prisma.unidad.update({
      where: { id: idUnit },
      data: data,
    });
    return unidad;
  }

  async updateStatusUnit(idUnit: number): Promise<Unidad> {
    const unit = await prisma.unidad.findFirst({
      where: {
        id: idUnit,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateUnit =
      unit?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;

    const unitUpdate = await prisma.unidad.update({
      where: { id: idUnit },
      data: {
        eliminado: newStateUnit,
      },
    });
    return unitUpdate;
  }
}

export const prismaUnitRepository = new PrismaUnitRepository();

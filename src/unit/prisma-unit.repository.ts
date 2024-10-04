import prisma from "@/config/prisma.config";
import {
  I_CreateUnitBD,
  I_Unit,
  I_UpdateUnitBodyValidation,
} from "./models/unit.interface";
import { E_Estado_BD, Unidad } from "@prisma/client";
import { UnitRepository } from "./unit.repository";

class PrismaUnitRepository implements UnitRepository {
  async findByCode(code: string, project_id: number): Promise<Unidad | null> {
    const unit = await prisma.unidad.findFirst({
      where: {
        codigo: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return unit;
  }
  async codeMoreHigh(project_id: number): Promise<Unidad | null> {
    const lastUnit = await prisma.unidad.findFirst({
      where: {
        // eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastUnit;
  }
  async existsSymbol(
    symbol: string,
    project_id: number
  ): Promise<Unidad | null> {
    const unit = await prisma.unidad.findFirst({
      where: {
        simbolo: symbol,
        proyecto_id: project_id,
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

  async findAll(
    skip: number,
    limit: number,
    project_id: number
  ): Promise<{
    units: I_Unit[];
    total: number;
  }> {
    const [units, total]: [I_Unit[], number] = await prisma.$transaction([
      prisma.unidad.findMany({
        where: {
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
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
          proyecto_id: project_id,
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

  async existsName(name: string, project_id: number): Promise<Unidad | null> {
    const resourseCategory = await prisma.unidad.findFirst({
      where: {
        nombre: name,
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
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

  async updateUnit(
    data: I_UpdateUnitBodyValidation,
    idUnit: number
  ): Promise<Unidad> {
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

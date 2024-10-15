import { E_Estado_BD, IndiceUnificado } from "@prisma/client";
import prisma from "@/config/prisma.config";
import {
  I_CreateUnifiedIndexBD,
  I_UnifiedIndex,
  I_UpdateUnifiedIndexBody,
  I_UpdateUnifiedIndexBodyValidation,
} from "./models/unifiedIndex.interface";
import { UnifiedIndexRepository } from "./unifiedIndex.repository";
import { T_FindAllUnifiedIndex } from "./models/unifiedIndex.types";

class PrismaUnifiedIndexRepository implements UnifiedIndexRepository {
  async createUnifiedIndexMasive(
    data: I_CreateUnifiedIndexBD[]
  ): Promise<{ count: number }> {
    const unifiedIndex = await prisma.indiceUnificado.createMany({
      data,
    });
    return unifiedIndex;
  }
  async codeMoreHigh(project_id: number): Promise<IndiceUnificado | null> {
    const lastUnifiedIndex = await prisma.indiceUnificado.findFirst({
      where: {
        proyect_id: project_id,
        eliminado: E_Estado_BD.n,
      },
      orderBy: { codigo: "desc" },
    });
    return lastUnifiedIndex;
  }
  async findByCode(code: string): Promise<IndiceUnificado | null> {
    const unifiedIndex = await prisma.indiceUnificado.findFirst({
      where: {
        codigo: code,
        eliminado: E_Estado_BD.n,
      },
    });
    return unifiedIndex;
  }
  async existSymbol(
    symbol: string,
    project_id: number
  ): Promise<IndiceUnificado | null> {
    const unifiedIndex = await prisma.indiceUnificado.findFirst({
      where: {
        simbolo: symbol,
        proyect_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return unifiedIndex;
  }

  async findAll(
    skip: number,
    data: T_FindAllUnifiedIndex,
    project_id: number
  ): Promise<{
    unifiedIndex: I_UnifiedIndex[];
    total: number;
  }> {
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
    const [unifiedIndex, total]: [I_UnifiedIndex[], number] =
      await prisma.$transaction([
        prisma.indiceUnificado.findMany({
          where: {
            ...filters,
            proyect_id: project_id,
            eliminado: E_Estado_BD.n,
          },
          skip,
          take: data.queryParams.limit,
          omit: {
            eliminado: true,
          },
        }),
        prisma.indiceUnificado.count({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
          },
        }),
      ]);
    return { unifiedIndex, total };
  }

  async findById(idUnifiedIndex: number): Promise<I_UnifiedIndex | null> {
    const unifiedIndex = await prisma.indiceUnificado.findFirst({
      where: {
        id: idUnifiedIndex,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return unifiedIndex;
  }

  async existsName(
    name: string,
    project_id: number
  ): Promise<IndiceUnificado | null> {
    const unifiedIndex = await prisma.indiceUnificado.findFirst({
      where: {
        nombre: name,
        proyect_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return unifiedIndex;
  }

  async createUnifiedIndex(
    data: I_CreateUnifiedIndexBD
  ): Promise<IndiceUnificado> {
    const unifiedIndex = await prisma.indiceUnificado.create({
      data,
    });
    return unifiedIndex;
  }

  async updateUnifiedIndex(
    data: I_UpdateUnifiedIndexBodyValidation,
    idUnifiedIndex: number
  ): Promise<IndiceUnificado> {
    const unifiedIndex = await prisma.indiceUnificado.update({
      where: { id: idUnifiedIndex },
      data: data,
    });
    return unifiedIndex;
  }

  async updateStatusUnifiedIndex(
    idUnifiedIndex: number
  ): Promise<IndiceUnificado> {
    const unifiedIndex = await prisma.indiceUnificado.findFirst({
      where: {
        id: idUnifiedIndex,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateUnifiedIndex =
      unifiedIndex?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;

    const unifiedIndexUpdate = await prisma.indiceUnificado.update({
      where: { id: idUnifiedIndex },
      data: {
        eliminado: newStateUnifiedIndex,
      },
    });
    return unifiedIndexUpdate;
  }
}

export const prismaUnifiedIndexRepository = new PrismaUnifiedIndexRepository();

import { E_Estado_BD, ParteDiario } from "@prisma/client";
import prisma from "../config/prisma.config";
import { DailyPartRepository } from "./dailyPart.repository";
import {
  I_CreateDailyPartBD,
  I_UpdateDailyPartBD,
} from "./models/dailyPart.interface";
import { T_FindAllDailyPart } from "./models/dailyPart.types";

class PrismaDailyPartRepository implements DailyPartRepository {
  async findAllForJob(
    skip: number,
    data: T_FindAllDailyPart,
    job_id: number
  ): Promise<{ dailyParts: any[]; total: number }> {
    const [dailyParts, total]: [ParteDiario[], number] =
      await prisma.$transaction([
        prisma.parteDiario.findMany({
          where: {
            trabajo_id: job_id,
          },
          skip,
          take: data.queryParams.limit,
        }),
        prisma.parteDiario.count({
          where: {
            trabajo_id: job_id,
          },
        }),
      ]);

    const transformedDailyParts = dailyParts.map((part) => ({
      ...part,
      distanciamiento: part.distanciamiento === "y" ? true : false,
      protocolo_ingreso: part.protocolo_ingreso === "y" ? true : false,
      protocolo_salida: part.protocolo_salida === "y" ? true : false,
    }));

    return { dailyParts: transformedDailyParts, total };
  }

  async createDailyPart(
    data: I_CreateDailyPartBD
  ): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.create({
      data: data,
    });
    return dailyPart;
  }

  async updateDailyPart(
    data: I_UpdateDailyPartBD,
    daily_part_id: number
  ): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.update({
      where: {
        id: daily_part_id,
      },
      data: data,
    });
    return dailyPart;
  }

  async findById(daily_part_id: number): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.findFirst({
      where: {
        id: daily_part_id,
      },
      include: {
        Trabajo: true,
      },
    });
    return dailyPart;
  }
  async findByIdJob(job_id: number): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.findFirst({
      where: {
        trabajo_id: job_id,
      },
    });
    return dailyPart;
  }

  async codeMoreHigh(
    project_id: number,
    job_id: number
  ): Promise<ParteDiario | null> {
    const lastDailyPart = await prisma.parteDiario.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
        trabajo_id: job_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastDailyPart;
  }

  async updateDailyParForRisk(
    daily_part_id: number,
    risk_daily_part_id: number
  ): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.update({
      where: {
        id: daily_part_id,
      },
      data: {
        riesto_parte_diario_id: risk_daily_part_id,
      },
    });
    return dailyPart;
  }
}

export const prismaDailyPartRepository = new PrismaDailyPartRepository();

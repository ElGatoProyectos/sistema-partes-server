import { E_Estado_BD, ParteDiario } from "@prisma/client";
import prisma from "../config/prisma.config";
import { DailyPartRepository } from "./dailyPart.repository";
import {
  I_CreateDailyPartBD,
  I_UpdateDailyPartBD,
} from "./models/dailyPart.interface";

class PrismaDailyPartRepository implements DailyPartRepository {
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
}

export const prismaDailyPartRepository = new PrismaDailyPartRepository();

import { ParteDiario } from "@prisma/client";
import prisma from "../config/prisma.config";
import { DailyPartRepository } from "./dailyPart.repository";
import { I_CreateDailyPartBD } from "./models/dailyPart.interface";

class PrismaDailyPartRepository implements DailyPartRepository {
  async createDailyPart(
    data: I_CreateDailyPartBD
  ): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.create({
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
}

export const prismaDailyPartRepository = new PrismaDailyPartRepository();

import { ParteDiario } from "@prisma/client";
import prisma from "@/config/prisma.config";
import { DailyPartRepository } from "./dailyPart.repository";
import { I_CreateDailyPartBD } from "./models/dailyPart.interface";

class PrismaDailyPartRepository implements DailyPartRepository {
  createDailyPart(data: I_CreateDailyPartBD): void {
    throw new Error("Method not implemented.");
  }
  findById(daily_part: number): void {
    throw new Error("Method not implemented.");
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

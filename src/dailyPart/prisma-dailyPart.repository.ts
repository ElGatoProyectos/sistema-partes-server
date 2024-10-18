import { ParteDiario } from "@prisma/client";
import prisma from "@/config/prisma.config";
import { DailyPartRepository } from "./dailyPart.repository";

class PrismaDailyPartRepository implements DailyPartRepository {
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

import { ReporteTren } from "@prisma/client";
import { TrainReportRepository } from "./trainReport.repository";
import prisma from "@/config/prisma.config";

class PrismaTrainReportRepository implements TrainReportRepository {
  async findById(train_id: number): Promise<ReporteTren | null> {
    const train = await prisma.reporteTren.findFirst({
      where: {
        tren_id: train_id,
      },
    });
    return train;
  }
}

export const prismaTrainReportRepository = new PrismaTrainReportRepository();

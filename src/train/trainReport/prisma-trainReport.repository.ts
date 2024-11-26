import { TrainReportRepository } from "./trainReport.repository";
import prisma from "../../config/prisma.config";
import { I_CreateReportTrainBD, I_UpdateReportTrainBD } from "./models/trainReport.interface";
import { ResporteAvanceTren } from "@prisma/client";

class PrismaTrainReportRepository implements TrainReportRepository {
  async updateReportsForTrain(report_train_id:number,value: number,field:string): Promise<ResporteAvanceTren | null>  {
    const report= await prisma.resporteAvanceTren.update({
      where:{
        id:report_train_id
      },
      data:{
       [field]:value
      }
    })
    return report
  }
  async findByIdTrainAndWeek(train_id: number, week_id: number): Promise<ResporteAvanceTren | null> {
    const train = await prisma.resporteAvanceTren.findFirst({
      where: {
        tren_id: train_id,
        semana_id: week_id
      },
    });
    return train;
  }
  async createReportsForTrain(data: I_CreateReportTrainBD):Promise<ResporteAvanceTren | null>  {
    const report= await prisma.resporteAvanceTren.create({
      data:data
    })
    return report
  }
  async findByIdTrain(train_id: number): Promise<ResporteAvanceTren | null> {
    const train = await prisma.resporteAvanceTren.findFirst({
      where: {
        tren_id: train_id,
      },
    });
    return train;
  }
}

export const prismaTrainReportRepository = new PrismaTrainReportRepository();

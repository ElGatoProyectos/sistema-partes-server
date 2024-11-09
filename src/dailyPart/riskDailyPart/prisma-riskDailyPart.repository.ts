import { E_Estado_BD, RiesgoParteDiario } from "@prisma/client";
import {
  I_CreateRiskDailyPartBD,
  I_RiskDailyPartForId,
  I_UpdateRiskDailyPartBD,
} from "./models/riskDailyPart.interface";
import { RiskDailyPartRepository } from "./riskDailyPart.respository";
import prisma from "../../config/prisma.config";

class PrismaRiskDailyPartRepository implements RiskDailyPartRepository {
  async updateRiskDailyPart(
    data: I_UpdateRiskDailyPartBD,
    risk_daily_part: number
  ): Promise<RiesgoParteDiario | null> {
    const riskDailyPart = await prisma.riesgoParteDiario.update({
      where: {
        id: risk_daily_part,
      },
      data: data,
    });
    return riskDailyPart;
  }
  async createRiskDailyPart(
    data: I_CreateRiskDailyPartBD
  ): Promise<RiesgoParteDiario | null> {
    const riskDailyPart = await prisma.riesgoParteDiario.create({
      data: data,
    });
    return riskDailyPart;
  }

  async findById(risk_daily_part: number): Promise<I_RiskDailyPartForId | null> {
    const riskDailyPart = await prisma.riesgoParteDiario.findFirst({
      where: {
        id: risk_daily_part,
        eliminado: E_Estado_BD.n,
       
      },
      omit: {
        eliminado:true,
        fecha_creacion:true,
        proyecto_id:true
      }
    });
    return riskDailyPart;
  }

  async updateStateRiskDailyPart(
    risk_daily_part: number
  ): Promise<RiesgoParteDiario | null> {
    const riskDailyPart = await prisma.riesgoParteDiario.update({
      where: {
        id: risk_daily_part,
      },
      data: {
        eliminado: E_Estado_BD.y,
      },
    });
    return riskDailyPart;
  }
}

export const prismaRiskDailyPartRepository =
  new PrismaRiskDailyPartRepository();

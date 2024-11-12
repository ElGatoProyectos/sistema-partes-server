import { DailyPartMORepository } from "./dailyPartMO.repository";
import prisma from "../../config/prisma.config";
import { ParteDiarioMO } from "@prisma/client";
import { T_FindAllDailyPartMO } from "./models/dailyPartMO.types";
import { I_UpdateDailyPartMOBD } from "./models/dailyPartMO.interface";

class PrismaDailyPartMORepository implements DailyPartMORepository {
  async delete(daily_part_mo_id: number) {
    await prisma.parteDiarioMO.delete({
      where: {
        id: daily_part_mo_id,
      },
    });
  }
  async findById(daily_part_mo_id: number): Promise<ParteDiarioMO | null> {
    const dailyPartMO = await prisma.parteDiarioMO.findFirst({
      where: {
        id: daily_part_mo_id,
      },
      include: {
        ManoObra: true,
        Proyecto: true,
      },
    });
    return dailyPartMO;
  }
  async updateDailyPartMO(
    data: I_UpdateDailyPartMOBD,
    daily_part_mo_id: number
  ): Promise<ParteDiarioMO | null> {
    const dailyPartMO = await prisma.parteDiarioMO.update({
      where: {
        id: daily_part_mo_id,
      },
      data: data,
    });
    return dailyPartMO;
  }
  async findAll(
    skip: number,
    data: T_FindAllDailyPartMO,
    project_id: number,
    daily_part_id: number
  ): Promise<{ dailyPartsMO: any[]; total: number }> {
    const dailyPartsMO = await prisma.parteDiarioMO.findMany({
      where: {
        proyecto_id: project_id,
        parte_diario_id: daily_part_id,
      },
      include: {
        ManoObra: true,
      },
      skip,
      take: data.queryParams.limit,
    });

    const total = await prisma.parteDiarioMO.count({
      where: {
        proyecto_id: project_id,
      },
    });

    const dailyParts = dailyPartsMO.map((item) => {
      const { ManoObra, ...ResData } = item;
      return {
        id: ResData.id,
        dni: ManoObra.documento_identidad,
        nombre_completo:
          ManoObra.nombre_completo +
          " " +
          ManoObra.apellido_materno +
          " " +
          ManoObra.apellido_paterno,
        hp: ResData.hora_parcial,
        hn: ResData.hora_normal,
        h60: ResData.hora_60,
        h100: ResData.hora_100,
      };
    });

    return { dailyPartsMO: dailyParts, total };
  }
  async findAllWithOutPagination(
    project_id: number,
    daily_part_id: number
  ): Promise<ParteDiarioMO[] | null> {
    const dailyParts = await prisma.parteDiarioMO.findMany({
      where: {
        proyecto_id: project_id,
        parte_diario_id: daily_part_id,
      },
    });
    return dailyParts;
  }
  async createDailyPartMO(
    ids: number[],
    project_id: number,
    daily_part_id: number
  ) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const data = ids.map((id) => ({
      hora_inicio: 0,
      hora_fin: 0,
      hora_parcial: 0,
      hora_normal: 0,
      hora_60: 0,
      hora_100: 0,
      mano_obra_id: id,
      proyecto_id: project_id,
      parte_diario_id: daily_part_id,
      fecha_creacion: date,
    }));

    await prisma.parteDiarioMO.createMany({
      data: data,
    });
  }
}

export const prismaDailyPartMORepository = new PrismaDailyPartMORepository();

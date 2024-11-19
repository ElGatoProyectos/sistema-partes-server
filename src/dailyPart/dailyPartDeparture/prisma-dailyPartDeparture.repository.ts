import { ParteDiario, ParteDiarioPartida } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DailyPartDepartureRepository } from "./dailyPartDeparture.repository";
import { UpdateDailyPartDeparture } from "./models/dailyPartDeparture.interface";
import { T_FindAllDailyPartDeparture } from "./models/dailyPartDeparture.types";

class PrismaDailyPartDepartureRepository
  implements DailyPartDepartureRepository
{
  async findAllForDailyPart(
    daily_part_id: number
  ): Promise<ParteDiarioPartida[] | null> {
    const details = await prisma.parteDiarioPartida.findMany({
      where: {
        parte_diario_id: daily_part_id,
      },
    });
    return details;
  }
  async createDailyPartDeparture(
    ids_departure: number[],
    daily_part_id: number
  ) {
    const data = ids_departure.map((id) => ({
      parte_diario_id: daily_part_id,
      partida_id: id,
      cantidad_utilizada: 0,
    }));

    await prisma.parteDiarioPartida.createMany({
      data: data,
    });
  }

  async updateDailyPartDeparture(
    data: UpdateDailyPartDeparture,
    daily_part_departure_id: number
  ): Promise<ParteDiarioPartida | null> {
    const dailyPart = await prisma.parteDiarioPartida.update({
      where: {
        id: daily_part_departure_id,
      },
      data: data,
    });
    return dailyPart;
  }

  async findById(
    daily_part_departure_id: number
  ): Promise<ParteDiarioPartida | null> {
    const dailyPart = await prisma.parteDiarioPartida.findFirst({
      where: {
        id: daily_part_departure_id,
      },
      include: {
        ParteDiario: {
          include: {
            Trabajo: true,
          },
        },
        Partida: true,
      },
    });

    return dailyPart;
  }
  async findByIdDailyPartAndDeparture(
    daily_part_id: number,
    departure_id: number
  ): Promise<ParteDiarioPartida | null> {
    const dailyPart = await prisma.parteDiarioPartida.findFirst({
      where: {
        parte_diario_id: daily_part_id,
        partida_id: departure_id,
      },
    });

    return dailyPart;
  }

  async findAllForDailyPartDeparture(
    skip: number,
    data: T_FindAllDailyPartDeparture,
    ids: number[]
  ): Promise<{ details: any[]; total: number }> {
    const details = await prisma.parteDiarioPartida.findMany({
      where: {
        Partida: {
          id: {
            in: ids,
          },
        },
      },
      include: {
        ParteDiario: {
          include: {
            Trabajo: true,
          },
        },
        Partida: {
          include: {
            Unidad: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });

    const total = await prisma.parteDiarioPartida.count({
      where: {
        Partida: {
          id: {
            in: ids,
          },
        },
      },
    });

    const detailsForJob = details.map((detail) => {
      const { ParteDiario, Partida, ...ResData } = detail;
      const { Trabajo, ...data } = ParteDiario;
      const { Unidad } = Partida;
      return {
        parte_diario_partida_id: ResData.id,
        codigo: Partida.item,
        partida: Partida.partida,
        unidad: Unidad?.simbolo ? Unidad?.simbolo : null,
        cantidad_utilizada: ResData.cantidad_utilizada,
      };
    });

    return {
      details: detailsForJob,
      total,
    };
  }
}

export const prismaDailyPartDepartureRepository =
  new PrismaDailyPartDepartureRepository();

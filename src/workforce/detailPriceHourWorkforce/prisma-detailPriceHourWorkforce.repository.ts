import prisma from "@/config/prisma.config";
import { DetailPriceHoueWorkforceRepository } from "./detailPriceHourWorkforce.repository";
import { DetallePrecioHoraMO, E_Estado_BD } from "@prisma/client";
import {
  I_CreateDetailPriceHourWorkforceBD,
  I_UpdateDetailPriceHourWorkforceBD,
} from "./models/detailPriceHourWorkforce.interface";

class PrismaDetailPriceHourWorkforceRepository
  implements DetailPriceHoueWorkforceRepository
{
  async updateDetailPriceHourWorkforce(
    price_hour_id: number,
    data: I_UpdateDetailPriceHourWorkforceBD[]
  ) {
    await Promise.all(
      data.map(async (detail) => {
        await prisma.detallePrecioHoraMO.updateMany({
          where: {
            categoria_obrero_id: detail.categoria_obrero_id,
            precio_hora_mo_id: price_hour_id,
          },
          data: {
            hora_normal: detail.hora_normal,
            hora_extra_60: detail.hora_extra_60,
            hora_extra_100: detail.hora_extra_100,
            categoria_obrero_id: detail.categoria_obrero_id,
            precio_hora_mo_id: price_hour_id,
          },
        });
      })
    );
  }
  async createDetailPriceHourWorkforce(
    data: I_CreateDetailPriceHourWorkforceBD[]
  ): Promise<{ count: number }> {
    const detail = await prisma.detallePrecioHoraMO.createMany({
      data: data,
    });
    return detail;
  }
  async findByIdCategoryWorkforce(
    categoryWorkforce_id: number
  ): Promise<DetallePrecioHoraMO | null> {
    const detail = await prisma.detallePrecioHoraMO.findFirst({
      where: {
        categoria_obrero_id: categoryWorkforce_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return detail;
  }
}

export const prismaDetailPriceHourWorkforceRepository =
  new PrismaDetailPriceHourWorkforceRepository();

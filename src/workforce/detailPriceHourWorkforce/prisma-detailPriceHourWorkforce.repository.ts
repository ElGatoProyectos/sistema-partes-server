import prisma from "@/config/prisma.config";
import { DetailPriceHoueWorkforceRepository } from "./detailPriceHourWorkforce.repository";
import { DetallePrecioHoraMO, E_Estado_BD } from "@prisma/client";
import { I_CreateDetailPriceHourWorkforceBD } from "./models/detailPriceHourWorkforce.interface";

class PrismaDetailPriceHourWorkforceRepository
  implements DetailPriceHoueWorkforceRepository
{
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

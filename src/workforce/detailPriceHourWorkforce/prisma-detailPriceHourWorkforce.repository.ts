import prisma from "@/config/prisma.config";
import { DetailPriceHoueWorkforceRepository } from "./detailPriceHourWorkforce.repository";
import { DetallePrecioHoraMO, E_Estado_BD } from "@prisma/client";

class PrismaDetailPriceHourWorkforceRepository
  implements DetailPriceHoueWorkforceRepository
{
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

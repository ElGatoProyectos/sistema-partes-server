import prisma from "@/config/prisma.config";
import { DetalleMaestroObraCapataz } from "@prisma/client";
import { DetailMasterBuilderForemanRepository } from "./detailMasterBuilderForeman.repository";
import { T_FindAllDetailMasterBuilderForeman } from "./models/detailMasterBuilderForeman.types";

class PrismaDetailMasterBuilderForemanRepository
  implements DetailMasterBuilderForemanRepository
{
  getAllDetailMasterBuilderForeman(
    data: T_FindAllDetailMasterBuilderForeman,
    project_id: number
  ): void {
    throw new Error("Method not implemented.");
  }
  async createDetailMasterBuilderForeman(
    user_id: number,
    user2_id: number,
    project_id: number
  ): Promise<DetalleMaestroObraCapataz> {
    const detailWorkforceForeman =
      await prisma.detalleMaestroObraCapataz.create({
        data: {
          usuario_mo_id: user_id,
          usuario_capataz_id: user2_id,
          proyecto_id: project_id,
        },
      });
    return detailWorkforceForeman;
  }
  async verifyIdDetailMasterBuilderForeman(
    user_id: number
  ): Promise<DetalleMaestroObraCapataz | null> {
    const detail = await prisma.detalleMaestroObraCapataz.findFirst({
      where: {
        OR: [{ usuario_capataz_id: user_id }, { usuario_mo_id: user_id }],
      },
    });
    return detail;
  }
}

export const prismaDetailMasterBuilderForemanRepository =
  new PrismaDetailMasterBuilderForemanRepository();

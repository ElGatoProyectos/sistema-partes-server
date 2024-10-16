import { DetalleIngenieroProduccionMaestroObra } from "@prisma/client";
import { DetailProductionEngineerMasterBuilder } from "./detailProductionEngineerMasterBuilder.repository";
import { T_FindAllDetailProductionEngineerMasterBuilder } from "./models/detailProductionEngineerMasterBuilder.types";
import prisma from "@/config/prisma.config";

class PrismaDetailProductionEngineerMasterBuilderRepository
  implements DetailProductionEngineerMasterBuilder
{
  getAllDetailProductionEngineerMasterBuilder(
    data: T_FindAllDetailProductionEngineerMasterBuilder,
    project_id: number
  ): void {
    throw new Error("Method not implemented.");
  }

  async createDetailProductionEngineerMasterBuilder(
    user_id: number,
    user2_id: number,
    proeject_id: number
  ): Promise<DetalleIngenieroProduccionMaestroObra> {
    const detailProuductionEngineerWorkforce =
      await prisma.detalleIngenieroProduccionMaestroObra.create({
        data: {
          usuario_ingeniero_id: user_id,
          usuario_produccion_id: user2_id,
          proyecto_id: proeject_id,
        },
      });
    return detailProuductionEngineerWorkforce;
  }
  async verifyIdDetailProductionEngineerMasterBuilder(
    user_id: number
  ): Promise<DetalleIngenieroProduccionMaestroObra | null> {
    const detail = await prisma.detalleIngenieroProduccionMaestroObra.findFirst(
      {
        where: {
          OR: [
            { usuario_ingeniero_id: user_id },
            { usuario_produccion_id: user_id },
          ],
        },
      }
    );
    return detail;
  }
}

export const prismaDetailProductionEngineerMasterBuilderRepository =
  new PrismaDetailProductionEngineerMasterBuilderRepository();

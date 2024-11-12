import { Combo, detalle_combo_mo } from "@prisma/client";
import { ComboRepository } from "./combo.repository";
import { I_CreateComboBD } from "./models/combo.interface";
import prisma from "../../config/prisma.config";

class PrismaComboRepository implements ComboRepository {
  async findAllWithOutPagination(project_id: number): Promise<Combo[] | null> {
    const combos = await prisma.combo.findMany({
      where: {
        proyecto_id: project_id,
      },
    });
    return combos;
  }
  async findAllWithOutPaginationOfDetail(
    combo_id: number
  ): Promise<detalle_combo_mo[] | null> {
    const detailsComboMO = await prisma.detalle_combo_mo.findMany({
      where: {
        combo_id: combo_id,
      },
    });
    return detailsComboMO;
  }
  async createCombo(data: I_CreateComboBD): Promise<Combo | null> {
    const combo = await prisma.combo.create({
      data: data,
    });
    return combo;
  }

  async createDetailCombo(idsWorkforces: number[], combo_id: number) {
    const data = idsWorkforces.map((id) => ({
      combo_id: combo_id,
      mo_id: id,
    }));
    await prisma.detalle_combo_mo.createMany({
      data: data,
    });
  }

  async findById(combo_id: number): Promise<Combo | null> {
    const combo = await prisma.combo.findFirst({
      where: {
        id: combo_id,
      },
    });
    return combo;
  }
}

export const prismaComboRepository = new PrismaComboRepository();

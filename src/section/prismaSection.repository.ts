import prisma from "../config/prisma.config";
import { SectionRepository } from "./section.repository";
import { Seccion } from "@prisma/client";
import { I_CreateSeccionBD } from "./models/section.repository";

class PrismaSectionRepository implements SectionRepository {
  async findById(section_id: number): Promise<Seccion | null> {
    const section = await prisma.seccion.findFirst({
      where: {
        id: section_id,
      },
    });
    return section;
  }
  async createSection(data: I_CreateSeccionBD): Promise<Seccion | null> {
    const action = await prisma.seccion.create({
      data,
    });
    return action;
  }
}

export const prismaSectionRepository = new PrismaSectionRepository();

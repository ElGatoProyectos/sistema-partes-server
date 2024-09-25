import { Accion } from "@prisma/client";
import { ActionRepository } from "./action.repository";
import prisma from "@/config/prisma.config";
import { I_CreateAccionBD } from "./models/action.repository";

class PrismaActionRepository implements ActionRepository {
  async createAction(data: I_CreateAccionBD): Promise<Accion | null> {
    const action = await prisma.accion.create({
      data,
    });
    return action;
  }

  async findById(action_id: number): Promise<Accion | null> {
    const section = await prisma.accion.findFirst({
      where: {
        id: action_id,
      },
    });
    return section;
  }
}

export const prismaActionRepository = new PrismaActionRepository();

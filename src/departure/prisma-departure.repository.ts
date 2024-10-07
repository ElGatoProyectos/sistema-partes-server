import { E_Estado_BD, Partida } from "@prisma/client";
import { DepartureRepository } from "./departure.repository";
import {
  I_CreateDepartureBD,
  I_Departure,
  I_UpdateDepartureBD,
} from "./models/departure.interface";
import { T_FindAllDeparture } from "./models/departure.types";
import prisma from "@/config/prisma.config";

class PrismaDepartureRepository implements DepartureRepository {
  async createDeparture(data: I_CreateDepartureBD): Promise<Partida> {
    const departure = await prisma.partida.create({
      data,
    });
    return departure;
  }
  async updateDeparture(
    data: I_UpdateDepartureBD,
    departure_id: number
  ): Promise<Partida> {
    const departure = await prisma.partida.update({
      where: { id: departure_id },
      data: data,
    });
    return departure;
  }

  findAll(skip: number, data: T_FindAllDeparture, project_id: number): void {
    throw new Error("Method not implemented.");
  }
  async findById(departure_id: number): Promise<I_Departure | null> {
    const departure = await prisma.partida.findFirst({
      where: {
        id: departure_id,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return departure;
  }
  async existsName(name: string, project_id: number): Promise<Partida | null> {
    const departure = await prisma.partida.findFirst({
      where: {
        partida: name,
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
    });
    return departure;
  }
  updateStatusDeparture(idUser: number): void {
    throw new Error("Method not implemented.");
  }
  async findByCode(code: string, project_id: number): Promise<Partida | null> {
    const unit = await prisma.partida.findFirst({
      where: {
        id_interno: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return unit;
  }
  async codeMoreHigh(project_id: number): Promise<Partida | null> {
    const lastUnit = await prisma.partida.findFirst({
      where: {
        proyecto_id: project_id,
      },
      orderBy: { id_interno: "desc" },
    });
    return lastUnit;
  }
}

export const prismaDepartureRepository = new PrismaDepartureRepository();

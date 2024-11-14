import { E_Estado_BD, PrecioHoraMO } from "@prisma/client";
import {
  I_CreatePriceHourWorkforceBD,
  I_PriceHourWorkforceAll,
  I_UpdatePriceHourWorkforceBody,
} from "./models/priceHourWorkforce.interface";
import { T_FindAllPriceHourWorkforce } from "./models/priceHourWorkforce.types";
import { PriceHourRepository } from "./priceHourWorkforce.repository";
import prisma from "../../config/prisma.config";

class PrismaPriceHourWorkforceRepository implements PriceHourRepository {
  async findById(price_hour_id: number): Promise<PrecioHoraMO | null> {
    const priceHourMO = await prisma.precioHoraMO.findFirst({
      where: {
        id: price_hour_id,
      },
      include: {
        DetallePrecioHoraMO: {
          include: {
            CategoriaObrero: true,
          },
        },
      },
    });
    return priceHourMO;
  }
  async findAll(
    skip: number,
    data: T_FindAllPriceHourWorkforce,
    project_id: number
  ): Promise<{ priceHours: I_PriceHourWorkforceAll[]; total: number }> {
    const priceHours = await prisma.precioHoraMO.findMany({
      where: {
        proyecto_id: project_id,
      },
      include: {
        DetallePrecioHoraMO: {
          include: {
            CategoriaObrero: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });
    const total = await prisma.precioHoraMO.count({
      where: {
        proyecto_id: project_id,
      },
    });

    return { priceHours, total };
  }
  async createPriceHourWorkforce(
    data: I_CreatePriceHourWorkforceBD
  ): Promise<PrecioHoraMO> {
    const priceHourMO = await prisma.precioHoraMO.create({
      data,
    });
    return priceHourMO;
  }

  async updatePriceHourWorkforce(
    data: I_UpdatePriceHourWorkforceBody,
    price_hour_workforce_id: number
  ): Promise<PrecioHoraMO> {
    const priceHourMO = await prisma.precioHoraMO.update({
      where: {
        id: price_hour_workforce_id,
      },
      data,
    });
    return priceHourMO;
  }

  async findByDate(date: Date): Promise<PrecioHoraMO | null> {
    const dateNew = date;
    dateNew.setUTCHours(0, 0, 0, 0);
    const priceHourMO = await prisma.precioHoraMO.findFirst({
      where: {
        fecha_inicio: { lte: dateNew },
        fecha_fin: { gte: dateNew },
      },
    });
    return priceHourMO;
  }
}

export const prismaPriceHourWorkforceRepository =
  new PrismaPriceHourWorkforceRepository();

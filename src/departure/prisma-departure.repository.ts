import { E_Estado_BD, Partida } from "@prisma/client";
import { DepartureRepository } from "./departure.repository";
import {
  I_CreateDepartureBD,
  I_Departure,
  I_UpdateDepartureBD,
} from "./models/departure.interface";
import { T_FindAllDeparture } from "./models/departure.types";
import prisma from "../config/prisma.config";
import { T_FindAllTaskDailyPartDeparture } from "../dailyPart/dailyPartDeparture/models/dailyPartDeparture.types";

class PrismaDepartureRepository implements DepartureRepository {
  async updateMetradoTotal(
    departure_id: number,
    total: number
  ): Promise<Partida | null> {
    const departure = await prisma.partida.update({
      where: {
        id: departure_id,
      },
      data: {
        metrado_total: total,
      },
    });
    return departure;
  }
  async findAllWithOutPagination(
    project_id: number
  ): Promise<Partida[] | null> {
    const departures = await prisma.partida.findMany({
      where: {
        proyecto_id: project_id,
      },
    });
    return departures;
  }
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

  async findAll(
    skip: number,
    data: T_FindAllDeparture,
    project_id: number
  ): Promise<{ departures: I_Departure[]; total: number }> {
    let filters: any = {};
    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filters.partida = {
          contains: data.queryParams.search,
        };
      } else {
        filters.id_interno = {
          contains: data.queryParams.search,
        };
      }
    }

    const [departures, total]: [I_Departure[], number] =
      await prisma.$transaction([
        prisma.partida.findMany({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
          include: {
            Unidad: true,
          },
          skip,
          take: data.queryParams.limit,
          omit: {
            eliminado: true,
          },
          orderBy: {
            id_interno: "desc",
          },
        }),
        prisma.partida.count({
          where: {
            ...filters,
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { departures, total };
  }
  async findAllForTask(
    idsDailyPart: number[]= [],
    project_id:number
  ): Promise<{ departures: I_Departure[]; total: number; totalDailyPartDeparture:number }> {

    const result= await prisma.parteDiarioPartida.count({
      where:{
        ParteDiario:{
          id:{
            in:idsDailyPart
          }
        }
      }
    })

    if(result===0){
      const [departures, total]: [I_Departure[], number] =
      await prisma.$transaction([
        prisma.partida.findMany({
          where: {
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
          include: {
            Unidad: true,
          },
          omit: {
            eliminado: true,
          },
          orderBy: {
            item: "asc",
          },
        }),
        prisma.partida.count({
          where: {
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { departures, total, totalDailyPartDeparture:result };
    }else{
      const [departures, total]: [I_Departure[], number] =
      await prisma.$transaction([
        prisma.partida.findMany({
          where: {
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
            ParteDiarioPartida:{
              some:{
                ParteDiario:{
                  id:{
                    in: idsDailyPart
                  }
                }
              }
            }
          },
          include: {
            Unidad: true,
          },
          omit: {
            eliminado: true,
          },
          orderBy: {
            item: "asc",
          },
        }),
        prisma.partida.count({
          where: {
            eliminado: E_Estado_BD.n,
            proyecto_id: project_id,
          },
        }),
      ]);
    return { departures, total , totalDailyPartDeparture:result };
    }
    
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
  async updateStatusDeparture(departure_id: number): Promise<Partida | null> {
    const departure = await prisma.partida.findFirst({
      where: {
        id: departure_id,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateDeparture =
      departure?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const departureUpdate = await prisma.partida.update({
      where: { id: departure_id },
      data: {
        eliminado: newStateDeparture,
      },
    });

    return departureUpdate;
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

  async isLastId(project_id: number): Promise<Partida | null> {
    const job = await prisma.partida.findFirst({
      where: {
        proyecto_id: project_id,
      },
      orderBy: {
        id_interno: "desc",
      },
    });
    return job;
  }
}

export const prismaDepartureRepository = new PrismaDepartureRepository();

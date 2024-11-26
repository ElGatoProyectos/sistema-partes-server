import { E_Estado_BD, ParteDiario } from "@prisma/client";
import prisma from "../config/prisma.config";
import { DailyPartRepository } from "./dailyPart.repository";
import {
  I_CreateDailyPartBD,
  I_DailyPart,
  I_DailyPartId,
  I_ParteDiario,
  I_UpdateDailyPartBD,
} from "./models/dailyPart.interface";
import {
  T_FindAllDailyPart,
  T_FindAllDailyPartForJob,
} from "./models/dailyPart.types";
import { converToDate } from "../common/utils/date";

class PrismaDailyPartRepository implements DailyPartRepository {
  async findAllForIds(ids: number[]): Promise<I_ParteDiario[] | null> {
    const dailyParts = await prisma.parteDiario.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        Trabajo: {
          include: {
            UnidadProduccion: true,
          },
        },
        RiesgoParteDiario: {
          omit: {
            eliminado: true,
            proyecto_id: true,
            fecha_creacion: true,
          },
        },
      },
    });
    return dailyParts;
  }

  async findAllForDate(): Promise<I_ParteDiario[] | null> {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const dailyParts = await prisma.parteDiario.findMany({
      where: {
        fecha: date,
      },
      include: {
        Trabajo: {
          include: {
            UnidadProduccion: true,
          },
        },
        RiesgoParteDiario: true,
      },
    });
    return dailyParts;
  }
  async findAllForDateSend(dates: string[]): Promise<I_ParteDiario[] | null> {
    const normalizedDates = dates.map((date) => {
      const d = converToDate(date);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    });
    const dailyParts = await prisma.parteDiario.findMany({
      where: {
        fecha: {
          in: normalizedDates,
        },
      },
      include: {
        Trabajo: {
          include: {
            UnidadProduccion: true,
          },
        },
        RiesgoParteDiario: true,
      },
    });
    return dailyParts;
  }
  async findAllForProject(
    skip: number,
    data: T_FindAllDailyPart,
    project_id: number
  ): Promise<{ dailyParts: any[]; total: number }> {
    let filters: any = {};
    let filtersTrain: any = {};
    let filtersJob: any = {};
    if (data.queryParams.job) {
      filtersJob.nombre = {
        contains: data.queryParams.job,
      };
    }
    if (data.queryParams.train) {
      filtersTrain.nombre = {
        contains: data.queryParams.train,
      };
    }
    if (data.queryParams.stage && data.queryParams.stage != "TODOS") {
      filters.etapa = data.queryParams.stage;
    }

    if (data.queryParams.start && data.queryParams.end) {
      const start = converToDate(data.queryParams.start);
      start.setUTCHours(0, 0, 0, 0);
      const end = converToDate(data.queryParams.end);
      end.setUTCHours(0, 0, 0, 0);
      filters.fecha = {
        gte: start,
        lte: end,
      };
    }
    const dailyParts = await prisma.parteDiario.findMany({
      where: {
        ...filters,
        proyecto_id: project_id,
        Trabajo: {
          ...filtersJob,
          Tren: {
            ...filtersTrain,
          },
        },
      },
      include: {
        Trabajo: {
          include: {
            Tren: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });

    const dailys = dailyParts.map((item) => {
      const { Trabajo } = item;
      const { Tren, ...ResData } = Trabajo;
      return {
        id: item.id,
        etapa: item.etapa,
        nombre: item.nombre,
        trabajo: ResData.nombre,
        tren: Tren.nombre,
        actividad: item.descripcion_actividad ? item.descripcion_actividad : "",
        fecha: item.fecha,
      };
    });

    const total = await prisma.parteDiario.count({
      where: {
        ...filters,
        proyecto_id: project_id,
        Trabajo: {
          ...filtersJob,
          Tren: {
            ...filtersTrain,
          },
        },
      },
    });

    return { dailyParts: dailys, total };
  }
  async findByIdRisk(risk_part_id: number): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.findFirst({
      where: {
        riesto_parte_diario_id: risk_part_id,
      },
    });
    return dailyPart;
  }
  async findAllForJob(
    skip: number,
    data: T_FindAllDailyPartForJob,
    job_id: number
  ): Promise<{ dailyParts: any[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.date) {
      const date = converToDate(data.queryParams.date);
      date.setUTCHours(0, 0, 0, 0);
      filters.fecha = date;
    }

    const dailyParts = await prisma.parteDiario.findMany({
      where: {
        ...filters,
        trabajo_id: job_id,
      },

      omit: {
        eliminado: true,
        trabajo_id: true,
        proyecto_id: true,
        fecha_creacion: true,
        riesto_parte_diario_id: true,
        jornada: true,
        hora_inicio: true,
        hora_fin: true,
        nota: true,
        distanciamiento: true,
        protocolo_ingreso: true,
        protocolo_salida: true,
      },

      skip,
      take: data.queryParams.limit,
    });

    const total = await prisma.parteDiario.count({
      where: {
        ...filters,
        trabajo_id: job_id,
      },
    });

    return { dailyParts, total };
  }

  async findByIdValidation(daily_part_id: number): Promise<I_DailyPart | null> {
    const dailyPart = await prisma.parteDiario.findFirst({
      where: {
        id: daily_part_id,
      },
      include: {
        Trabajo: {
          include:{
            Tren:true,
            UnidadProduccion:true
          }
        },
      },
    });

    return dailyPart;
  }
  async findById(daily_part_id: number): Promise<I_DailyPartId | null> {
    const dailyPart = await prisma.parteDiario.findFirst({
      where: {
        id: daily_part_id,
      },
      include: {
        RiesgoParteDiario: {
          omit: {
            id: true,
            fecha_creacion: true,
            proyecto_id: true,
            eliminado: true,
          },
        },
        Trabajo: true,
      },
      omit: {
        codigo: true,
        eliminado: true,
        trabajo_id: true,
        proyecto_id: true,
        fecha_creacion: true,
        riesto_parte_diario_id: true,
      },
    });

    if (!dailyPart) return null;

    const { RiesgoParteDiario, Trabajo, ...rest } = dailyPart;
    return {
      ...rest,
      restriccion: RiesgoParteDiario,
      nombre_trabajo: Trabajo.nombre,
    };
  }

  async createDailyPart(
    data: I_CreateDailyPartBD
  ): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.create({
      data: data,
    });
    return dailyPart;
  }

  async updateDailyPart(
    data: I_UpdateDailyPartBD,
    daily_part_id: number
  ): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.update({
      where: {
        id: daily_part_id,
      },
      data: data,
    });
    return dailyPart;
  }

  async findByIdJob(job_id: number): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.findFirst({
      where: {
        trabajo_id: job_id,
      },
    });
    return dailyPart;
  }

  async codeMoreHigh(
    project_id: number,
    job_id: number
  ): Promise<ParteDiario | null> {
    const lastDailyPart = await prisma.parteDiario.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
        trabajo_id: job_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastDailyPart;
  }

  async updateDailyParForRisk(
    daily_part_id: number,
    risk_daily_part_id: number | null
  ): Promise<ParteDiario | null> {
    const dailyPart = await prisma.parteDiario.update({
      where: {
        id: daily_part_id,
      },
      data: {
        riesto_parte_diario_id: risk_daily_part_id,
      },
    });
    return dailyPart;
  }
}

export const prismaDailyPartRepository = new PrismaDailyPartRepository();

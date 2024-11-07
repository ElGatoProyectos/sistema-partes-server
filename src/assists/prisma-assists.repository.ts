import prisma from "../config/prisma.config";
import { BankWorkforceRepository } from "./assists.repository";
import {
  I_AssistsWorkforce,
  I_CreateAssistsWorkforceBD,
} from "./models/assists.interface";
import { T_FindAllAssists, T_FindAllWeekAssists } from "./models/assists.types";
import {
  Asistencia,
  E_Asistencia_BD,
  E_Estado_Asistencia_BD,
  E_Estado_BD,
  ManoObra,
  Semana,
} from "@prisma/client";
import { weekValidation } from "../week/week.validation";

class PrismaAssistsRepository implements BankWorkforceRepository {
  async createAssists(data: I_CreateAssistsWorkforceBD): Promise<Asistencia> {
    const asssists = await prisma.asistencia.create({
      data,
    });
    return asssists;
  }

  async updateAssistsPresent(
    assists_id: number,
    data: E_Asistencia_BD
  ): Promise<Asistencia> {
    const assists = await prisma.asistencia.update({
      where: {
        id: assists_id,
      },
      data: {
        asistencia: data,
        estado_asignacion: E_Estado_Asistencia_BD.NO_ASIGNADO,
      },
    });
    return assists;
  }
  async updateAssistsNotPresent(
    assists_id: number,
    data: E_Asistencia_BD
  ): Promise<Asistencia> {
    const assists = await prisma.asistencia.update({
      where: {
        id: assists_id,
      },
      data: {
        asistencia: data,
        estado_asignacion: E_Estado_Asistencia_BD.FALTA,
      },
    });
    return assists;
  }
  async findByDate(date: Date): Promise<Asistencia | null> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const assists = await prisma.asistencia.findFirst({
      where: {
        fecha: {
          gte: startOfDay, // Fecha mayor o igual al inicio del día
          lte: endOfDay, // Fecha menor o igual al fin del día
        },
        eliminado: E_Estado_BD.n,
      },
    });
    return assists;
  }
  async findByIdMoAndDate(mano_obra_id: number): Promise<Asistencia | null> {
    const date = new Date();
    // const peruOffset = -5 * 60;

    // const peruDate = new Date(
    //   date.getTime() + (date.getTimezoneOffset() + peruOffset) * 60000
    // );
    // peruDate.setUTCHours(0, 0, 0, 0);
    date.setUTCHours(0, 0, 0, 0);

    const assists = await prisma.asistencia.findFirst({
      where: {
        fecha: date,
        mano_obra_id: mano_obra_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return assists;
  }
  async updateStatusAssists(assists_id: number): Promise<Asistencia | null> {
    const assists = await prisma.asistencia.update({
      where: {
        id: assists_id,
      },
      data: {
        eliminado: E_Estado_BD.y,
      },
    });
    return assists;
  }

  async findAll(
    skip: number,
    data: T_FindAllAssists,
    project_id: number,
    responsible_id?: number
  ): Promise<{ assistsConverter: any[]; total: number }> {
    const peruDate = new Date();
    peruDate.setUTCHours(0, 0, 0, 0);
    let filters: any = {};
    filters.fecha = peruDate;
    let filtersName: any = {};
    const valuesState: { [key: string]: string } = {
      ASIGNADO: E_Estado_Asistencia_BD.ASIGNADO,
      DOBLEMENTE_ASIGNADO: E_Estado_Asistencia_BD.DOBLEMENTE_ASIGNADO,
      FALTA: E_Estado_Asistencia_BD.FALTA,
      NO_ASIGNADO: E_Estado_Asistencia_BD.NO_ASIGNADO,
    };

    if (
      data.queryParams.search &&
      !data.queryParams.date &&
      !data.queryParams.week
    ) {
      filters.fecha = peruDate;
      filtersName.nombre_completo = {
        contains: data.queryParams.search,
      };
    }
    if (
      data.queryParams.state &&
      !data.queryParams.date &&
      !data.queryParams.week
    ) {
      filters.fecha = peruDate;
      const result = valuesState[data.queryParams.state];
      filters.estado_asignacion = result;
    }

    if (data.queryParams.week) {
      if (data.queryParams.search) {
        filtersName.nombre_completo = {
          contains: data.queryParams.search,
        };
      }
      if (data.queryParams.state) {
        const result = valuesState[data.queryParams.state];
        filters.estado_asignacion = result;
      }
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      const week = weekResponse.payload as Semana;
      filters.fecha = {
        gte: new Date(new Date(week.fecha_inicio).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        lte: new Date(new Date(week.fecha_fin).setHours(23, 59, 59, 999)), // Fin del día
      };
    }
    if (data.queryParams.date) {
      filters.fecha = {
        gte: new Date(new Date(data.queryParams.date).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        lte: new Date(
          new Date(data.queryParams.date).setHours(23, 59, 59, 999)
        ),
      };
      if (data.queryParams.search) {
        filtersName.nombre_completo = {
          contains: data.queryParams.search,
        };
      }
      if (data.queryParams.state) {
        const result = valuesState[data.queryParams.state];
        filters.estado_asignacion = result;
      }
    }
    if (data.queryParams.week && data.queryParams.date) {
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      const week = weekResponse.payload as Semana;
      filters.fecha = {
        gte: new Date(new Date(week.fecha_inicio).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        lte: new Date(new Date(week.fecha_fin).setHours(23, 59, 59, 999)), // Fin del día
      };
      if (data.queryParams.search) {
        filtersName.nombre_completo = {
          contains: data.queryParams.search,
        };
      }
      if (data.queryParams.state) {
        const result = valuesState[data.queryParams.state];
        filters.estado_asignacion = result;
      }
    }

    const assists = await prisma.asistencia.findMany({
      where: {
        ...filters,
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
        ManoObra: {
          ...filtersName,
          usuario_id: responsible_id,
        },
      },
      include: {
        ManoObra: {
          include: {
            Usuario: true, // Incluye el usuario relacionado con ManoObra
          },
        },
      },
      skip,
      take: data.queryParams.limit,
      omit: {
        eliminado: true,
      },
    });
    const total = await prisma.asistencia.count({
      where: {
        ...filters,
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
        ManoObra: {
          ...filtersName,
          usuario_id: responsible_id,
        },
      },
    });

    const assistsConverter = assists.map((item) => {
      const { ManoObra, ...ResData } = item;
      const { Usuario, ...ManoObraData } = ManoObra || {}; // Desestructuramos Usuario de ManoObra
      return {
        Asistencia: ResData,
        ManoObra: ManoObraData,
        Responsable: Usuario,
      };
    });
    return { assistsConverter, total };
  }

  async findAllByWeek(
    skip: number,
    data: T_FindAllWeekAssists,
    project_id: number
  ): Promise<{ assistsConverter: any[]; total: number }> {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    let filters: any = {};
    const weekResponse = await weekValidation.findByDate(date);
    const week = weekResponse.payload as Semana;
    filters.fecha = {
      gte: week.fecha_inicio, // Mayor o igual a la fecha de inicio
      lte: week.fecha_fin, // Fin del día
    };
    let filtersName: any = {};
    if (data.queryParams.week) {
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      const week = weekResponse.payload as Semana;
      filters.fecha = {
        gte: new Date(new Date(week.fecha_inicio).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        lte: new Date(new Date(week.fecha_fin).setHours(23, 59, 59, 999)), // Fin del día
      };
    }
    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filtersName.OR = [
          {
            nombre_completo: {
              contains: data.queryParams.search,
            },
          },
          {
            apellido_materno: {
              contains: data.queryParams.search,
            },
          },
          {
            apellido_paterno: {
              contains: data.queryParams.search,
            },
          },
        ];
      } else {
        filtersName.documento_identidad = {
          contains: data.queryParams.search,
        };
      }
    }

    const assists = await prisma.asistencia.findMany({
      where: {
        ...filters,
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
        ManoObra: {
          ...filtersName,
        },
      },
      include: {
        ManoObra: {
          include: {
            Usuario: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
      omit: {
        eliminado: true,
      },
    });

    const assistsMap = new Map();
    assists.forEach((item) => {
      const { ManoObra, ...ResData } = item;
      const { Usuario, ...ManoObraData } = ManoObra || {};
      const key = ManoObraData.id;
      if (!assistsMap.has(key)) {
        assistsMap.set(key, {
          ManoObra: ManoObraData,
          Lunes: "F",
          Martes: "F",
          Miercoles: "F",
          Jueves: "F",
          Viernes: "F",
          Sabado: "F",
          Domingo: "F",
        });
      }
      const dayMap = assistsMap.get(key);

      switch (ResData.fecha.getUTCDay()) {
        case 1:
          dayMap.Lunes = ResData.asistencia;
          break;
        case 2:
          dayMap.Martes = ResData.asistencia;
          break;
        case 3:
          dayMap.Miercoles = ResData.asistencia;
          break;
        case 4:
          dayMap.Jueves = ResData.asistencia;
          break;
        case 5:
          dayMap.Viernes = ResData.asistencia;
          break;
        case 6:
          dayMap.Sabado = ResData.asistencia;
          break;
        case 0:
          dayMap.Domingo = ResData.asistencia;
          break;
      }
    });

    const assistsConverter = Array.from(assistsMap.values());
    let total = assistsConverter.length;
    return { assistsConverter, total };
  }
  async findById(assists_id: number): Promise<I_AssistsWorkforce | null> {
    const assists = await prisma.asistencia.findFirst({
      where: {
        id: assists_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return assists;
  }
}

export const prismaAssistsRepository = new PrismaAssistsRepository();

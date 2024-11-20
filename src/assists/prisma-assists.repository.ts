import prisma from "../config/prisma.config";
import { BankWorkforceRepository } from "./assists.repository";
import {
  I_AssistsWorkforce,
  I_CreateAssistsWorkforceBD,
  I_UpdateAssitsBD,
} from "./models/assists.interface";
import {
  EstadoAsistenciaCounts,
  T_FindAllAssists,
  T_FindAllAssistsForDailyPart,
  T_FindAllWeekAssists,
} from "./models/assists.types";
import {
  Asistencia,
  detalle_combo_mo,
  E_Asistencia_BD,
  E_Estado_Asistencia_BD,
  E_Estado_BD,
  ManoObra,
  Semana,
} from "@prisma/client";
import { weekValidation } from "../week/week.validation";
import { comboValidation } from "../dailyPart/combo/combo.validation";

class PrismaAssistsRepository implements BankWorkforceRepository {
  async updateAssists(
    data: I_UpdateAssitsBD,
    assists_id: number,
    workforce_id: number
  ): Promise<Asistencia | null> {
    const updateAssists = await prisma.asistencia.update({
      where: {
        id: assists_id,
        mano_obra_id: workforce_id,
      },
      data: data,
    });
    return updateAssists;
  }
  async updateManyStatusAsigned(ids: number[], project_id: number) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    // await Promise.all(
    //   ids.map(async (id) => {
    //     await prisma.asistencia.updateMany({
    //       where: {
    //         fecha: date,
    //         proyecto_id: project_id,
    //       },
    //       data: {
    //         estado_asignacion: E_Estado_Asistencia_BD.ASIGNADO,
    //       },
    //     });
    //   })
    // );
    await prisma.asistencia.updateMany({
      where: {
        fecha: date,
        proyecto_id: project_id,
        mano_obra_id: { in: ids },
      },
      data: {
        estado_asignacion: E_Estado_Asistencia_BD.ASIGNADO,
      },
    });
  }
  async updateManyStatusAsignedX2(ids: number[], project_id: number) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    await prisma.asistencia.updateMany({
      where: {
        fecha: date,
        proyecto_id: project_id,
        mano_obra_id: { in: ids },
      },
      data: {
        estado_asignacion: E_Estado_Asistencia_BD.DOBLEMENTE_ASIGNADO,
      },
    });
  }
  async updateManyStatusNotAsigned(ids: number[], project_id: number) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    await prisma.asistencia.updateMany({
      where: {
        fecha: date,
        proyecto_id: project_id,
        mano_obra_id: { in: ids },
      },
      data: {
        estado_asignacion: E_Estado_Asistencia_BD.NO_ASIGNADO,
      },
    });
  }
  async findAllWithOutPagination(
    project_id: number
  ): Promise<Asistencia[] | null> {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const asssits = await prisma.asistencia.findMany({
      where: {
        fecha: date,
        proyecto_id: project_id,
      },
    });
    return asssits;
  }
  async findDatesByLegend(project_id: number): Promise<EstadoAsistenciaCounts> {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    const result = await prisma.asistencia.groupBy({
      where: {
        fecha: date,
        proyecto_id: project_id,
      },
      by: ["estado_asignacion"],
      _count: {
        estado_asignacion: true,
      },
    });

    const counts = {
      ASIGNADO: 0,
      NO_ASIGNADO: 0,
      FALTA: 0,
      DOBLEMENTE_ASIGNADO: 0,
    };

    result.forEach((item) => {
      counts[item.estado_asignacion] = item._count.estado_asignacion;
    });

    return counts;
  }
  async findAllPresents(
    skip: number,
    data: T_FindAllAssistsForDailyPart,
    project_id: number
  ): Promise<{ assists: any[]; total: number }> {
    let filters: any = {};
    const filtersIds: { id?: { in: number[] } } = {}; // Inicializamos filters vacío
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    if (data.queryParams.search) {
      if (isNaN(data.queryParams.search as any)) {
        filters.OR = [
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
        filters.documento_identidad = {
          contains: data.queryParams.search,
        };
      }
    }

    if (data.queryParams.category && data.queryParams.category !== "TODOS") {
      filters.categoria_obrero_id = +data.queryParams.category;
    }

    let idsWorkforces: number[] = [];
    if (data.queryParams.combo) {
      const detailsCombo =
        await comboValidation.findManyWithOutPaginationOfDetail(
          +data.queryParams.combo
        );
      const detailsComboMO = detailsCombo.payload as detalle_combo_mo[];
      idsWorkforces = detailsComboMO.map((detail) => detail.mo_id);
      filtersIds.id = {
        in: idsWorkforces,
      };
    }
    // console.log("tiene los ids " + idsWorkforces);
    // console.log("ahora esto asi esta lleno ");
    // console.log(filtersIds);
    // console.log(date);

    const assists = await prisma.asistencia.findMany({
      where: {
        fecha: date,
        proyecto_id: project_id,
        // mano_obra_id: {
        //   notIn: ids,
        // },
        // mano_obra_id: {
        //   in: idsWorkforces,
        // },
        asistencia: E_Asistencia_BD.A,
        ManoObra: {
          ...filters,
          ...filtersIds,
        },
      },
      include: {
        ManoObra: {
          include: {
            CategoriaObrero: true,
            OrigenObrero: true,
            TipoObrero: true,
          },
        },
      },
      skip,
      take: data.queryParams.limit,
    });
    const total = await prisma.asistencia.count({
      where: {
        fecha: date,
        proyecto_id: project_id,
        asistencia: E_Asistencia_BD.A,
        ManoObra: {
          ...filters,
          ...filtersIds,
        },
      },
    });

    const assistsMO = assists.map((item) => {
      const { ManoObra, ...ResData } = item;
      const { CategoriaObrero, OrigenObrero, TipoObrero } = ManoObra;
      return {
        id: ManoObra.id,
        dni: ManoObra.documento_identidad,
        nombre_completo:
          ManoObra.nombre_completo +
          " " +
          ManoObra.apellido_materno +
          " " +
          ManoObra.apellido_paterno,
        categoria: CategoriaObrero?.nombre ? CategoriaObrero.nombre : null,
        origen: OrigenObrero?.nombre ? OrigenObrero?.nombre : null,
        puesto: TipoObrero?.nombre ? TipoObrero?.nombre : null,
        estado_asignacion: ResData.estado_asignacion,
      };
    });

    return { assists: assistsMO, total };
  }

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
    // const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    // const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const dateNew = date;
    dateNew.setUTCHours(0, 0, 0, 0);

    const assists = await prisma.asistencia.findFirst({
      where: {
        fecha: dateNew,
        eliminado: E_Estado_BD.n,
      },
    });
    return assists;
  }
  async findByDateAndWorkforce(
    date: Date,
    workforce_id: number
  ): Promise<Asistencia | null> {
    const dateNew = date;
    date.setUTCHours(0, 0, 0, 0);

    const assists = await prisma.asistencia.findFirst({
      where: {
        fecha: dateNew,
        mano_obra_id: workforce_id,
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
        // gte: new Date(new Date(week.fecha_inicio).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        // lte: new Date(new Date(week.fecha_fin).setHours(23, 59, 59, 999)), // Fin del día
        gte: week.fecha_inicio,
        lte: week.fecha_fin,
      };
    }
    if (data.queryParams.date) {
      filters.fecha = {
        // gte: new Date(new Date(data.queryParams.date).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        // lte: new Date(
        //   new Date(data.queryParams.date).setHours(23, 59, 59, 999)
        // ),
        gte: new Date(new Date(data.queryParams.date).setUTCHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        lte: new Date(new Date(data.queryParams.date).setUTCHours(0, 0, 0, 0)),
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
        gte: week.fecha_inicio,
        lte: week.fecha_fin,
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
      gte: week.fecha_inicio,
      lte: week.fecha_fin,
    };
    let filtersName: any = {};
    if (data.queryParams.week) {
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      const week = weekResponse.payload as Semana;
      filters.fecha = {
        gte: week.fecha_inicio,
        lte: week.fecha_fin,
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

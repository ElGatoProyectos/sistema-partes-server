import prisma from "@/config/prisma.config";
import { BankWorkforceRepository } from "./assists.repository";
import {
  I_AssistsWorkforce,
  I_CreateAssistsWorkforceBD,
  I_UpdateAssitsBD,
} from "./models/assists.interface";
import { T_FindAllAssists } from "./models/assists.types";
import { Asistencia, E_Estado_BD, Semana } from "@prisma/client";
import { weekValidation } from "@/week/week.validation";

class PrismaAssistsRepository implements BankWorkforceRepository {
  async createAssists(data: I_CreateAssistsWorkforceBD): Promise<Asistencia> {
    const asssists = await prisma.asistencia.create({
      data,
    });
    return asssists;
  }

  async updateAssists(
    assists_id: number,
    data: I_UpdateAssitsBD
  ): Promise<Asistencia> {
    const assists = await prisma.asistencia.update({
      where: {
        id: assists_id,
      },
      data: data,
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
  updateStatusAssists(bank_id: number): void {
    throw new Error("Method not implemented.");
  }

  async findAll(
    skip: number,
    data: T_FindAllAssists,
    project_id: number,
    responsible_id?: number
  ): Promise<{ assistsConverter: any[]; total: number }> {
    let filters: any = {};

    if (data.queryParams.search) {
      filters.nombre = {
        contains: data.queryParams.search,
      };
    }
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
    if (data.queryParams.date) {
      filters.fecha = {
        gte: new Date(new Date(data.queryParams.date).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        lte: new Date(
          new Date(data.queryParams.date).setHours(23, 59, 59, 999)
        ),
      };
    }
    if (data.queryParams.week && data.queryParams.date) {
      console.log("entro a ambos");
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      const week = weekResponse.payload as Semana;
      filters.fecha = {
        gte: new Date(new Date(week.fecha_inicio).setHours(0, 0, 0, 0)), // Mayor o igual a la fecha de inicio
        lte: new Date(new Date(week.fecha_fin).setHours(23, 59, 59, 999)), // Fin del día
      };
    }
    const assists = await prisma.asistencia.findMany({
      where: {
        ...filters,
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
        ManoObra: {
          usuario_id: responsible_id,
        },
      },
      include: {
        ManoObra: true,
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
          usuario_id: responsible_id,
        },
      },
    });

    const assistsConverter = assists.map((item) => {
      const { ManoObra, ...ResData } = item;
      return {
        Asistencia: ResData,
        ManoObra: ManoObra,
      };
    });
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

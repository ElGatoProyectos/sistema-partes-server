import { E_Estado_BD, E_Trabajo_Estado, Trabajo } from "@prisma/client";
import { JobRepository } from "./job.repository";
import {
  I_CreateJobBD,
  I_Job,
  I_UpdateJobBD,
  I_UpdateJobBDValidationExcel,
} from "./models/job.interface";
import prisma from "@/config/prisma.config";
import { T_FindAllJob } from "./models/job.types";
import { converToDate } from "@/common/utils/date";

class PrismaJobRepository implements JobRepository {
  async updateJobFromExcel(
    data: I_UpdateJobBDValidationExcel,
    job_id: number
  ): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: data,
    });

    return job;
  }
  async createJob(data: I_CreateJobBD): Promise<Trabajo> {
    const job = await prisma.trabajo.create({
      data,
    });
    return job;
  }
  async updateJob(data: I_UpdateJobBD, job_id: number): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: data,
    });
    return job;
  }
  async updateJobCost(cost: number, job_id: number): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: {
        costo_partida: cost,
      },
    });
    return job;
  }
  async updateJobCostOfLabor(labor: number, job_id: number): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: {
        costo_mano_obra: labor,
      },
    });
    return job;
  }
  async updateJobMaterialCost(
    material: number,
    job_id: number
  ): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: {
        costo_material: material,
      },
    });
    return job;
  }
  async updateJobEquipment(
    equipment: number,
    job_id: number
  ): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: {
        costo_equipo: equipment,
      },
    });
    return job;
  }
  async updateJobSeveral(several: number, job_id: number): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: {
        costo_varios: several,
      },
    });
    return job;
  }
  async updateStatusJob(job_id: number): Promise<Trabajo | null> {
    const job = await prisma.trabajo.findFirst({
      where: {
        id: job_id,
        eliminado: E_Estado_BD.n,
      },
    });

    const newStateTrain =
      job?.eliminado == E_Estado_BD.y ? E_Estado_BD.n : E_Estado_BD.y;
    const trainUpdate = await prisma.trabajo.update({
      where: { id: job_id },
      data: {
        eliminado: newStateTrain,
      },
    });

    return trainUpdate;
  }
  async findByCode(code: string, project_id: number): Promise<Trabajo | null> {
    const job = await prisma.trabajo.findFirst({
      where: {
        codigo: code,
        proyecto_id: project_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return job;
  }
  async findByJobForTrain(train_id: number): Promise<Trabajo | null> {
    const job = await prisma.trabajo.findFirst({
      where: {
        tren_id: train_id,
        eliminado: E_Estado_BD.n,
      },
    });
    return job;
  }
  async existsName(name: string, project_id: number): Promise<Trabajo | null> {
    const job = await prisma.trabajo.findFirst({
      where: {
        nombre: name,
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
    });
    return job;
  }
  async findAll(
    skip: number,
    data: T_FindAllJob,
    project_id: number
  ): Promise<{ jobs: I_Job[]; total: number }> {
    let filtersTrain: any = {};
    const searchFilter = this.getSearchFilter(data.queryParams.search);

    const fechaInicioFilter = this.getFechaInicioFilter(
      data.queryParams.fecha_inicio
    );
    const fechaFinalizacionFilter = this.getFechaFinalizacionFilter(
      data.queryParams.fecha_finalizacion
    );

    const stateFilter = this.getStateFilter(data.queryParams.state);

    const [jobs, total]: [I_Job[], number] = await prisma.$transaction([
      prisma.trabajo.findMany({
        where: {
          ...searchFilter,
          ...fechaInicioFilter,
          ...fechaFinalizacionFilter,
          ...stateFilter,
          Tren: {
            ...filtersTrain,
          },
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
        skip,
        take: data.queryParams.limit,
        omit: {
          eliminado: true,
        },
        orderBy: {
          codigo: "asc",
        },
      }),
      prisma.trabajo.count({
        where: {
          ...searchFilter,
          ...fechaInicioFilter,
          ...fechaFinalizacionFilter,
          ...stateFilter,
          Tren: {
            ...filtersTrain,
          },
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { jobs, total };
  }
  getSearchFilter(search: string) {
    if (!search) return {};
    return isNaN(search as any)
      ? { nombre: { contains: search } }
      : { codigo: { contains: search } };
  }
  getFechaInicioFilter(fecha_inicio: string) {
    if (!fecha_inicio) return {};
    const date = converToDate(fecha_inicio);
    return { fecha_inicio: { gte: date } };
  }

  getFechaFinalizacionFilter(fecha_finalizacion: string) {
    if (!fecha_finalizacion) return {};
    const date = converToDate(fecha_finalizacion);
    return { fecha_finalizacion: { gte: date } };
  }

  getStateFilter(state: string) {
    if (!state) return {};
    if (state === E_Trabajo_Estado.EJECUTADO) {
      return { estado_trabajo: E_Trabajo_Estado.EJECUTADO };
    } else if (state === E_Trabajo_Estado.PROGRAMADO) {
      return { estado_trabajo: E_Trabajo_Estado.PROGRAMADO };
    } else if (state === E_Trabajo_Estado.TERMINADO) {
      return { estado_trabajo: E_Trabajo_Estado.TERMINADO };
    } else {
      return { estado_trabajo: E_Trabajo_Estado.PROGRAMADO };
    }
  }

  getTrenFilter(nameTrain: string) {
    if (!nameTrain) return {};
    return { nombre: { contains: nameTrain } };
  }
  // async findAll(
  //   skip: number,
  //   data: T_FindAllJob,
  //   project_id: number
  // ): Promise<{ jobs: I_Job[]; total: number }> {
  //   let filters: any = {};
  //   let filtersTrain: any = {};
  //   let fecha_inicio;
  //   let fecha_finalizacion;
  //   if (data.queryParams.search) {
  //     if (isNaN(data.queryParams.search as any)) {
  //       filters.nombre = {
  //         contains: data.queryParams.search,
  //       };
  //     } else {
  //       filters.codigo = {
  //         contains: data.queryParams.search,
  //       };
  //     }
  //   }

  //   if (data.queryParams.fecha_inicio) {
  //     fecha_inicio = converToDate(data.queryParams.fecha_inicio);
  //     filters.fecha_inicio = {
  //       gte: fecha_inicio,
  //     };
  //   }
  //   if (data.queryParams.fecha_finalizacion) {
  //     fecha_finalizacion = converToDate(data.queryParams.fecha_finalizacion);
  //     filters.fecha_finalizacion = {
  //       gte: fecha_finalizacion,
  //     };
  //   }
  //   if (data.queryParams.nameTrain) {
  //     filtersTrain.nombre = {
  //       contains: data.queryParams.nameTrain,
  //     };
  //   }
  //   const [jobs, total]: [I_Job[], number] = await prisma.$transaction([
  //     prisma.trabajo.findMany({
  //       where: {
  //         ...filters,
  //         Tren: {
  //           ...filtersTrain,
  //         },
  //         eliminado: E_Estado_BD.n,
  //         proyecto_id: project_id,
  //       },
  //       skip,
  //       take: data.queryParams.limit,
  //       omit: {
  //         eliminado: true,
  //       },
  //       orderBy: {
  //         codigo: "asc",
  //       },
  //     }),
  //     prisma.trabajo.count({
  //       where: {
  //         ...filters,
  //         Tren: {
  //           ...filtersTrain,
  //         },
  //         eliminado: E_Estado_BD.n,
  //         proyecto_id: project_id,
  //       },
  //     }),
  //   ]);
  //   return { jobs, total };
  // }

  async findById(job_id: number): Promise<I_Job | null> {
    const job = await prisma.trabajo.findFirst({
      where: {
        id: job_id,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return job;
  }
  async codeMoreHigh(project_id: number): Promise<Trabajo | null> {
    const lastJob = await prisma.trabajo.findFirst({
      where: {
        eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastJob;
  }
}

export const prismaJobRepository = new PrismaJobRepository();

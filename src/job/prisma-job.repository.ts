import { E_Estado_BD, Trabajo } from "@prisma/client";
import { JobRepository } from "./job.repository";
import { I_CreateJobBD, I_Job, I_UpdateJobBody } from "./models/job.interface";
import prisma from "@/config/prisma.config";

class PrismaJobRepository implements JobRepository {
  async createJob(data: I_CreateJobBD): Promise<Trabajo> {
    const job = await prisma.trabajo.create({
      data,
    });
    return job;
  }
  async updateJob(data: I_UpdateJobBody, job_id: number): Promise<Trabajo> {
    const job = await prisma.trabajo.update({
      where: { id: job_id },
      data: data,
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
  async existsName(name: string, project_id: number): Promise<Trabajo | null> {
    const job = await prisma.trabajo.findFirst({
      where: {
        nombre: name,
        proyecto_id: project_id,
      },
    });
    return job;
  }
  async findAll(
    skip: number,
    limit: number,
    project_id: number
  ): Promise<{ jobs: I_Job[]; total: number }> {
    let filters: any = {};
    const [jobs, total]: [I_Job[], number] = await prisma.$transaction([
      prisma.trabajo.findMany({
        where: {
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
        skip,
        take: limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.trabajo.count({
        where: {
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { jobs, total };
  }

  async findById(job_id: number): Promise<I_Job | null> {
    const train = await prisma.trabajo.findFirst({
      where: {
        id: job_id,
        eliminado: E_Estado_BD.n,
      },
      omit: {
        eliminado: true,
      },
    });
    return train;
  }
  async codeMoreHigh(project_id: number): Promise<Trabajo | null> {
    const lastJob = await prisma.trabajo.findFirst({
      where: {
        // eliminado: E_Estado_BD.n,
        proyecto_id: project_id,
      },
      orderBy: { codigo: "desc" },
    });
    return lastJob;
  }
  async searchNameJob(
    name: string,
    skip: number,
    limit: number,
    project_id: number
  ): Promise<{ jobs: I_Job[]; total: number }> {
    const [jobs, total]: [I_Job[], number] = await prisma.$transaction([
      prisma.trabajo.findMany({
        where: {
          nombre: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
        skip,
        take: limit,
        omit: {
          eliminado: true,
        },
      }),
      prisma.trabajo.count({
        where: {
          nombre: {
            contains: name,
          },
          eliminado: E_Estado_BD.n,
          proyecto_id: project_id,
        },
      }),
    ]);
    return { jobs, total };
  }
}

export const prismaJobRepository = new PrismaJobRepository();

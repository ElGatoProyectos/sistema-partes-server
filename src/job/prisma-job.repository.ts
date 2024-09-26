import { E_Estado_BD, Trabajo } from "@prisma/client";
import { JobRepository } from "./job.repository";
import { I_CreateJobBD, I_UpdateJobBody } from "./models/job.interface";
import prisma from "@/config/prisma.config";

class PrismaJobRepository implements JobRepository {
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
  // async existsName(name: string, project_id: number): Promise<T | null> {
  //   const train = await prisma.tren.findFirst({
  //     where: {
  //       nombre: name,
  //       proyecto_id: project_id,
  //     },
  //   });
  //   return train;
  // }
  findAll(skip: number, limit: number, project_id: number): void {
    throw new Error("Method not implemented.");
  }
  findById(idUser: number): void {
    throw new Error("Method not implemented.");
  }
  createJob(data: I_CreateJobBD): void {
    throw new Error("Method not implemented.");
  }
  existsName(name: string, project_id: number): void {
    throw new Error("Method not implemented.");
  }
  updateJob(data: I_UpdateJobBody): void {
    throw new Error("Method not implemented.");
  }
  updateStatusJob(idUser: number): void {
    throw new Error("Method not implemented.");
  }
  searchNameJob(
    name: string,
    skip: number,
    limit: number,
    project_id: number
  ): void {
    throw new Error("Method not implemented.");
  }
  codeMoreHigh(project_id: number): void {
    throw new Error("Method not implemented.");
  }
}

export const prismaJobRepository = new PrismaJobRepository();

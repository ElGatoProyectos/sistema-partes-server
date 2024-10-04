import { Partida } from "@prisma/client";
import { DepartureRepository } from "./departure.repository";
import {
  I_CreateDepartureBD,
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
  async updateDepartureFromExcel(
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
  findByCode(code: string, project_id: number): void {
    throw new Error("Method not implemented.");
  }
  findById(idUser: number): void {
    throw new Error("Method not implemented.");
  }
  existsName(name: string, project_id: number): void {
    throw new Error("Method not implemented.");
  }
  updateStatusDeparture(idUser: number): void {
    throw new Error("Method not implemented.");
  }
  codeMoreHigh(project_id: number): void {
    throw new Error("Method not implemented.");
  }
  // async findByCode(code: string, project_id: number): Promise<Trabajo | null> {
  //   const job = await prisma.trabajo.findFirst({
  //     where: {
  //       codigo: code,
  //       proyecto_id: project_id,
  //       eliminado: E_Estado_BD.n,
  //     },
  //   });
  //   return job;
  // }
  // async existsName(name: string, project_id: number): Promise<Trabajo | null> {
  //   const job = await prisma.trabajo.findFirst({
  //     where: {
  //       nombre: name,
  //       proyecto_id: project_id,
  //     },
  //   });
  //   return job;
  // }
  // async findById(job_id: number): Promise<I_Job | null> {
  //   const train = await prisma.trabajo.findFirst({
  //     where: {
  //       id: job_id,
  //       eliminado: E_Estado_BD.n,
  //     },
  //     omit: {
  //       eliminado: true,
  //     },
  //   });
  //   return train;
  // }
  // async codeMoreHigh(project_id: number): Promise<Trabajo | null> {
  //   const lastJob = await prisma.trabajo.findFirst({
  //     where: {
  //       // eliminado: E_Estado_BD.n,
  //       proyecto_id: project_id,
  //     },
  //     orderBy: { codigo: "desc" },
  //   });
  //   return lastJob;
  // }
}

export const prismaDepartureRepository = new PrismaDepartureRepository();

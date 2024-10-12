import prisma from "@/config/prisma.config";
import { DepartureJobRepository } from "./departure-job.repository";
import { DetalleTrabajoPartida } from "@prisma/client";
import { T_FindAllDepartureJob } from "./models/departure-job.types";
import {
  I_DepartureJob,
  I_DetailDepartureJob,
} from "./models/departureJob.interface";

class PrismaDepartureJobRepository implements DepartureJobRepository {
  async findAll(
    skip: number,
    data: T_FindAllDepartureJob
  ): Promise<{ detailsDepartureJob: any[]; total: number }> {
    let details: any = [];
    let total: any;
    [details, total] = await prisma.$transaction([
      prisma.detalleTrabajoPartida.findMany({
        skip,
        take: data.queryParams.limit,
        include: {
          Trabajo: true,
          Partida: true,
        },
      }),
      prisma.detalleTrabajoPartida.count({}),
    ]);

    const detailsDepartureJob = details.map((item: I_DetailDepartureJob) => {
      const { Trabajo, ...data } = item;
      const { Partida } = item;
      return {
        trabajo: Trabajo,
        partida: Partida,
        metrado_utilizado: item.metrado_utilizado,
      };
    });
    return { detailsDepartureJob, total };
  }

  async createDetailDepartureJob(
    job_id: number,
    departure_Id: number,
    metrado: number
  ): Promise<DetalleTrabajoPartida | null> {
    const departure_job = await prisma.detalleTrabajoPartida.create({
      data: {
        trabajo_id: job_id,
        partida_id: departure_Id,
        metrado_utilizado: metrado,
      },
    });
    return departure_job;
  }
}
export const prismaDepartureJobRepository = new PrismaDepartureJobRepository();

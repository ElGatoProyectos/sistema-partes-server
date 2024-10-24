import prisma from "@/config/prisma.config";
import { DepartureJobRepository } from "./departure-job.repository";
import { DetalleTrabajoPartida } from "@prisma/client";
import { T_FindAllDepartureJob } from "./models/departure-job.types";
import { I_DetailDepartureJob } from "./models/departureJob.interface";

class PrismaDepartureJobRepository implements DepartureJobRepository {
  async updateDetailDepartureJob(
    detail_id: number,
    departure_Id: number,
    metrado: number
  ): Promise<DetalleTrabajoPartida | null> {
    const detail = await prisma.detalleTrabajoPartida.update({
      where: {
        id: detail_id,
      },
      data: {
        partida_id: departure_Id,
        metrado_utilizado: metrado,
      },
    });
    return detail;
  }
  async findByIdJob(job_id: number): Promise<DetalleTrabajoPartida | null> {
    const detail = await prisma.detalleTrabajoPartida.findFirst({
      where: {
        trabajo_id: job_id,
      },
    });
    return detail;
  }
  async findByIdDeparture(
    departure_id: number
  ): Promise<DetalleTrabajoPartida | null> {
    const detail = await prisma.detalleTrabajoPartida.findFirst({
      where: {
        partida_id: departure_id,
      },
    });
    return detail;
  }
  async findByIdDepartureAndIdJob(
    departure_id: number,
    job_id: number
  ): Promise<DetalleTrabajoPartida | null> {
    const detail = await prisma.detalleTrabajoPartida.findFirst({
      where: {
        trabajo_id: job_id,
        partida_id: departure_id,
      },
    });
    return detail;
  }
  async findById(detail_id: number): Promise<DetalleTrabajoPartida | null> {
    const detail = await prisma.detalleTrabajoPartida.findFirst({
      where: {
        id: detail_id,
      },
      include: {
        Partida: true,
        Trabajo: true,
      },
    });
    return detail;
  }
  async deleteDetailDepartureJob(
    detail_id: number
  ): Promise<DetalleTrabajoPartida> {
    const detail = await prisma.detalleTrabajoPartida.delete({
      where: {
        id: detail_id,
      },
    });
    return detail;
  }
  async findAll(
    skip: number,
    data: T_FindAllDepartureJob
  ): Promise<{ detailsDepartureJob: any[]; total: number }> {
    let details: any = {};

    details = await prisma.detalleTrabajoPartida.findMany({
      where: {
        OR: [
          {
            Trabajo: {
              nombre: {
                contains: data.queryParams.search,
              },
            },
          },
          {
            Partida: {
              partida: {
                contains: data.queryParams.search,
              },
            },
          },
        ],
      },
      skip,
      take: data.queryParams.limit,
      include: {
        Trabajo: true,
        Partida: true,
      },
    });
    const total = await prisma.detalleTrabajoPartida.count({
      where: {
        OR: [
          {
            Trabajo: {
              nombre: {
                contains: data.queryParams.search,
              },
            },
          },
          {
            Partida: {
              partida: {
                contains: data.queryParams.search,
              },
            },
          },
        ],
      },
    });

    const detailsDepartureJob = details.map((item: I_DetailDepartureJob) => {
      const { Trabajo, Partida, ...data } = item;
      // const { Partida } = item;
      return {
        data: data,
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

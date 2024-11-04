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
      include: {
        Partida: true,
        Trabajo: true,
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
    data: T_FindAllDepartureJob,
    project_id: number
  ): Promise<{ detailsDepartureJob: any[]; total: number }> {
    let details: any = {};

    details = await prisma.detalleTrabajoPartida.findMany({
      where: {
        Trabajo: {
          proyecto_id: project_id,
        },
      },
      include: {
        Trabajo: true,
        Partida: true,
      },
    });

    const departureJobMap = new Map();

    details.forEach((item: I_DetailDepartureJob) => {
      const trabajoId = item.trabajo_id;
      if (!departureJobMap.has(trabajoId)) {
        departureJobMap.set(trabajoId, {
          trabajo: item.Trabajo,
          partidas: [],
        });
      }
      departureJobMap.get(trabajoId).partidas.push({
        partida: {
          ...item.Partida,
          metrado_utilizado: item.metrado_utilizado,
        },
      });
    });

    //[note] Transformo aca el map en un array ya q el retorno debe ser así
    let detailsDepartureJobFilter: any = [];
    detailsDepartureJobFilter = Array.from(departureJobMap.values());

    if (data.queryParams.search) {
      detailsDepartureJobFilter = Array.from(departureJobMap.values()).filter(
        (job) => job.trabajo.nombre.includes(data.queryParams.search)
      );
    }

    //[note] asi seria una forma de paginación de manera manual
    const detailsDepartureJob = detailsDepartureJobFilter.slice(
      skip,
      skip + data.queryParams.limit
    );

    return { detailsDepartureJob, total: detailsDepartureJob.length };
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

import prisma from "@/config/prisma.config";
import { DepartureJobRepository } from "./departure-job.repository";
import { DetalleTrabajoPartida } from "@prisma/client";
import { T_FindAllDepartureJob } from "./models/departure-job.types";
import { I_DetailDepartureJob } from "./models/departureJob.interface";

class PrismaDepartureJobRepository implements DepartureJobRepository {
  async findAll(
    skip: number,
    data: T_FindAllDepartureJob
  ): Promise<{ detailsDepartureJob: any[]; total: number }> {
    let details: any = {};
    let filterDeparture: any = {};
    let filterJob: any = {};
    let total: any = {};
    // const algo = await prisma.detalleTrabajoPartida.findMany({
    //   where: {
    //     Trabajo: {
    //       nombre: { contains: "Contrucciones " },
    //     },
    //     // Partida: {
    //     //   ...filterDeparture,
    //     // },
    //   },
    //   skip,
    //   take: data.queryParams.limit,
    //   include: {
    //     Trabajo: true,
    //     Partida: true,
    //   },
    // });
    // if (data.queryParams.departure) {
    //   filterDeparture.partida = data.queryParams.departure;
    // }

    // if (data.queryParams.job) {
    //   filterJob.nombre = data.queryParams.job;
    // }
    console.log(data.queryParams.job);
    console.log(data.queryParams.departure);
    details = await prisma.detalleTrabajoPartida.findMany({
      where: {
        Trabajo: {
          nombre: {
            contains: data.queryParams.job,
          },
        },
        // Partida: {
        //   partida: {
        //     contains: data.queryParams.departure,
        //   },
        // },
      },
      skip,
      take: data.queryParams.limit,
      include: {
        Trabajo: true,
        Partida: true,
      },
    });
    total = prisma.detalleTrabajoPartida.count({
      where: {
        Trabajo: {
          nombre: {
            contains: data.queryParams.job,
          },
        },
        Partida: {
          partida: {
            contains: data.queryParams.departure,
          },
        },
      },
    });

    console.log(details);
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

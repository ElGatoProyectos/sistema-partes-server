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
  async findAllWithPaginationForJob(
    skip: number,
    data: T_FindAllDepartureJob,
    project_id: number
  ): Promise<{ detailsDepartureJob: any[]; total: number }> {
    let details: any = {};
    let total: any = {};

    const detail = await prisma.trabajo.findMany({
      where: {
        DetalleTrabajoPartida: {
          some: {},
        },
        proyecto_id: project_id,
        OR: [
          {
            nombre: {
              contains: data.queryParams.search,
            },
          },
          {
            DetalleTrabajoPartida: {
              some: {
                Partida: {
                  partida: {
                    contains: data.queryParams.search,
                  },
                },
              },
            },
          },
        ],
      },
      skip,
      take: data.queryParams.limit,
    });

    const ids = detail.map((trabajo) => trabajo.id);
    details = await prisma.detalleTrabajoPartida.findMany({
      where: {
        Trabajo: {
          id: {
            in: ids,
          },
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
        ...item.Partida,
        metrado_utilizado: item.metrado_utilizado,
        id_detalle: item.id,
      });
    });
    // const detailsDepartureJob = details.map((item: I_DetailDepartureJob) => {
    //   const { Trabajo, Partida, ...data } = item;
    //   // const { Partida } = item;
    //   return {
    //     data: data,
    //     trabajo: Trabajo,
    //     partida: Partida,
    //     metrado_utilizado: item.metrado_utilizado,
    //   };
    // });

    let detailsDepartureJob = Array.from(departureJobMap.values());

    return {
      detailsDepartureJob,
      total: detailsDepartureJob.length,
    };
  }
  async findAllWithPaginationForDetail(
    skip: number,
    data: T_FindAllDepartureJob,
    project_id: number
  ): Promise<{ detailsDepartureJob: any[]; total: number }> {
    let details: any = {};
    let total;
    details = await prisma.detalleTrabajoPartida.findMany({
      where: {
        Trabajo: {
          proyecto_id: project_id,
        },
        Partida: {
          proyecto_id: project_id,
        },
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

    total = await prisma.detalleTrabajoPartida.count({
      where: {
        Trabajo: {
          proyecto_id: project_id,
        },
        Partida: {
          proyecto_id: project_id,
        },
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
      return {
        data: data,
        trabajo: Trabajo,
        partida: Partida,
        metrado_utilizado: item.metrado_utilizado,
      };
    });
    return {
      detailsDepartureJob,
      total,
    };
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

//[message] esto era de getall antes
// let details: any = {};

// details = await prisma.detalleTrabajoPartida.findMany({
//   where: {
//     Trabajo: {
//       proyecto_id: project_id,
//     },
//   },
//   include: {
//     Trabajo: true,
//     Partida: true,
//   },
// });

// const departureJobMap = new Map();

// details.forEach((item: I_DetailDepartureJob) => {
//   const trabajoId = item.trabajo_id;
//   if (!departureJobMap.has(trabajoId)) {
//     departureJobMap.set(trabajoId, {
//       trabajo: item.Trabajo,
//       partidas: [],
//     });
//   }
//   departureJobMap.get(trabajoId).partidas.push({
//     ...item.Partida,
//     metrado_utilizado: item.metrado_utilizado,
//     id_detalle: item.id,
//   });
// });

// //[note] Transformo aca el map en un array ya q el retorno debe ser así
// let detailsDepartureJob: any = [];
// let detailsDepartureJobWithOutFilter: any = [];
// let detailsDepartureJobFilter: any = [];
// detailsDepartureJobWithOutFilter = Array.from(departureJobMap.values());

// if (data.queryParams.search) {
//   detailsDepartureJobFilter = Array.from(departureJobMap.values()).filter(
//     (job) => job.trabajo.nombre.includes(data.queryParams.search)
//   );
//   //[note] asi seria una forma de paginación de manera manual
//   detailsDepartureJob = detailsDepartureJobFilter.slice(
//     skip,
//     skip + data.queryParams.limit
//   );
// } else {
//   //[note] asi seria una forma de paginación de manera manual
//   detailsDepartureJob = detailsDepartureJobWithOutFilter.slice(
//     skip,
//     skip + data.queryParams.limit
//   );
// }

// return {
//   detailsDepartureJob,
//   total: detailsDepartureJobWithOutFilter.length,
// };

import { Semana } from "@prisma/client";
import { httpResponse } from "../common/http.response";
import { weekValidation } from "../week/week.validation";
import prisma from "../config/prisma.config";

export async function dashboard1Cards(week?: string) {
  try {
    const filters = await captureFilterWeek(week);

    const partidas = await prisma.partida.findMany({
      where: {
        proyecto_id: 1,
      },
    });

    const presupuesto_meta = partidas.reduce((acum, partida) => {
      return acum + partida.metrado_inicial * partida.precio;
    }, 0);
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

export async function dashboard1ProduccionSemana(week?: string) {
  try {
    const filters = await captureFilterWeek(week);
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

// [success] listo!
export async function dashboard1ProduccionTren(week?: string) {
  try {
    const filters = await captureFilterWeek(week);

    const proyecto_id = 1;
    const trains = await prisma.tren.findMany({
      where: { proyecto_id },
      include: { Trabajo: true },
    });

    const response = await Promise.all(
      trains.map(async (train) => {
        let costo_mano_obra = 0;
        let costo_recursos = 0;
        let costo_patida = 0;

        const partesDiarios = await prisma.parteDiario.findMany({
          where: {
            proyecto_id,
            fecha: {
              gte: filters.fecha_inicio,
              lte: filters.fecha_fin,
            },
            trabajo_id: {
              in: train.Trabajo.map((trabajo) => {
                return trabajo.id;
              }),
            },
          },
        });

        // mejor iteramos el parte diario y de ahi sacamos las horas trabajadasde la mano de obra y ver los recursos

        for (const parteDiario of partesDiarios) {
          const ManoObraParteDiario = await prisma.parteDiarioMO.findMany({
            where: {
              proyecto_id,
              parte_diario_id: parteDiario.id,
            },
            include: { ManoObra: true },
          });

          const tablaSalarial = await prisma.precioHoraMO.findFirst({
            where: {
              fecha_inicio: {
                lte: parteDiario.fecha as any,
              },
              fecha_fin: {
                gte: parteDiario.fecha as any,
              },
            },
          });

          if (tablaSalarial) {
            for (const mo of ManoObraParteDiario) {
              if (mo.ManoObra.categoria_obrero_id) {
                const responsePrices = await capturePrices(
                  mo.ManoObra.categoria_obrero_id,
                  tablaSalarial.id
                );

                costo_mano_obra +=
                  responsePrices.hora_normal * (mo?.hora_normal || 0);
                costo_mano_obra +=
                  responsePrices.hora_extra_60 * (mo?.hora_60 || 0);
                costo_mano_obra +=
                  responsePrices.hora_extra_100 * (mo?.hora_100 || 0);
              }
            }
          }

          const recursos = await prisma.parteDiarioRecurso.findMany({
            where: {
              proyecto_id,
              parte_diario_id: parteDiario.id,
            },
            include: { Recurso: true },
          });

          costo_recursos += recursos.reduce(
            (acum, rec) => acum + (rec?.Recurso.precio || 0),
            0
          );

          const partidas = await prisma.parteDiarioPartida.findMany({
            where: {
              parte_diario_id: parteDiario.id,
            },
            include: { Partida: true },
          });

          costo_patida += partidas.reduce(
            (acum, rec) =>
              acum + (rec?.Partida.precio || 0) * rec.cantidad_utilizada,
            0
          );
        }
        return {
          tren: train.nombre,
          costo: costo_mano_obra + costo_recursos + costo_patida,
        };
      })
    );

    return;
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

// [success] listo!
export async function dashboard1ProduccionTrabajoSemana(week?: string) {
  try {
    const proyecto_id = 1;

    const filters = await captureFilterWeek(week);

    const works = await prisma.trabajo.findMany({
      where: {
        proyecto_id: 1,
      },
    });

    const response = await Promise.all(
      works.map(async (work) => {
        let costo_mano_obra = 0;
        let costo_recursos = 0;
        let costo_patida = 0;

        const partesDiarios = await prisma.parteDiario.findMany({
          where: {
            proyecto_id,
            fecha: {
              gte: filters.fecha_inicio,
              lte: filters.fecha_fin,
            },
            trabajo_id: work.id,
          },
        });

        for (const parteDiario of partesDiarios) {
          const ManoObraParteDiario = await prisma.parteDiarioMO.findMany({
            where: {
              proyecto_id,
              parte_diario_id: parteDiario.id,
            },
            include: { ManoObra: true },
          });

          const tablaSalarial = await prisma.precioHoraMO.findFirst({
            where: {
              fecha_inicio: {
                lte: parteDiario.fecha as any,
              },
              fecha_fin: {
                gte: parteDiario.fecha as any,
              },
            },
          });

          if (tablaSalarial) {
            for (const mo of ManoObraParteDiario) {
              if (mo.ManoObra.categoria_obrero_id) {
                const responsePrices = await capturePrices(
                  mo.ManoObra.categoria_obrero_id,
                  tablaSalarial.id
                );

                costo_mano_obra +=
                  responsePrices.hora_normal * (mo?.hora_normal || 0);
                costo_mano_obra +=
                  responsePrices.hora_extra_60 * (mo?.hora_60 || 0);
                costo_mano_obra +=
                  responsePrices.hora_extra_100 * (mo?.hora_100 || 0);
              }
            }
          }

          const recursos = await prisma.parteDiarioRecurso.findMany({
            where: {
              proyecto_id,
              parte_diario_id: parteDiario.id,
            },
            include: { Recurso: true },
          });

          costo_recursos += recursos.reduce(
            (acum, rec) => acum + (rec?.Recurso.precio || 0),
            0
          );

          const partidas = await prisma.parteDiarioPartida.findMany({
            where: {
              parte_diario_id: parteDiario.id,
            },
            include: { Partida: true },
          });

          costo_patida += partidas.reduce(
            (acum, rec) =>
              acum + (rec?.Partida.precio || 0) * rec.cantidad_utilizada,
            0
          );
        }

        return {
          tren: work.nombre,
          costo: costo_mano_obra + costo_recursos + costo_patida,
        };
      })
    );
    return httpResponse.SuccessResponse("reporte produccion", response);
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

// [success] listo!
export async function dashboard1AvanceTrabajoSemana(week?: string) {
  try {
    const filters = await captureFilterWeek(week);

    const works = await prisma.trabajo.findMany({
      where: {
        proyecto_id: 1,
      },
    });

    const response = await Promise.all(
      works.map(async (work) => {
        let total = 0;
        let consumido = 0;

        const parts = await prisma.detalleTrabajoPartida.findMany({
          where: {
            trabajo_id: work.id,
          },
          include: {
            Partida: true,
          },
        });

        parts.forEach((part) => {
          total += part.metrado_utilizado * part.Partida.precio;
        });

        // necesito saber cuantos partes diarios han consumido esta partida

        const detalleParteDiarioPartidas =
          await prisma.parteDiarioPartida.findMany({
            where: {
              partida_id: {
                in: parts.map((part) => part.Partida.id),
              },
            },
            include: {
              Partida: true,
            },
          });

        detalleParteDiarioPartidas.forEach((partDiario) => {
          consumido +=
            partDiario.cantidad_utilizada * partDiario.Partida.precio;
        });

        return {
          work: {
            ...work,
          },
          avance: (consumido / total) * 100,
        };
      })
    );

    return httpResponse.SuccessResponse("reporte produccion", response);
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

export async function dashboard1RitmoProduccionSemana(week?: string) {
  try {
    const filters = await captureFilterWeek(week);
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

export async function dashboard1RitmoDesviacionManoObraSemana(week?: string) {}

async function captureFilterWeek(week?: string) {
  let filters;
  if (week && week !== "undefined") {
    const weekResponse = await weekValidation.findByCode(week);
    const weekB = weekResponse.payload as Semana;
    filters = {
      fecha_inicio: weekB.fecha_inicio,
      fecha_fin: weekB.fecha_fin,
    };
  } else {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    const weekResponse = await weekValidation.findByDate(date);

    const week = weekResponse.payload as Semana;
    filters = {
      fecha_inicio: week.fecha_inicio,
      fecha_fin: week.fecha_fin,
    };
  }

  return filters;
}

type T_ResponsePrice = {
  hora_normal: number;
  hora_extra_60: number;
  hora_extra_100: number;
  categoria_obrero_id: number;
  precio_hora_mo_id: number;
};

async function capturePrices(
  categoria_id: number,
  precio_hora_mo_id?: number | null
): Promise<T_ResponsePrice> {
  if (!precio_hora_mo_id) {
    return {
      hora_normal: 0,
      hora_extra_60: 0,
      hora_extra_100: 0,
      categoria_obrero_id: 0,
      precio_hora_mo_id: 0,
    };
  }
  const prices = await prisma.detallePrecioHoraMO.findFirst({
    where: {
      precio_hora_mo_id: precio_hora_mo_id,
      categoria_obrero_id: categoria_id,
    },
  });

  if (!prices) {
    return {
      hora_normal: 0,
      hora_extra_60: 0,
      hora_extra_100: 0,
      categoria_obrero_id: 0,
      precio_hora_mo_id: 0,
    };
  }

  return {
    hora_normal: prices.hora_normal,
    hora_extra_60: prices.hora_extra_60,
    hora_extra_100: prices.hora_extra_100,
    categoria_obrero_id: prices.categoria_obrero_id,
    precio_hora_mo_id: prices.precio_hora_mo_id,
  };
}

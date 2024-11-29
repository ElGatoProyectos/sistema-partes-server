import { httpResponse } from "../common/http.response";
import prisma from "../config/prisma.config";

export async function reporteProduccionService(week?: string) {
  try {
    // buscamos todos los trabajos con partes diarios

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

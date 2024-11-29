import { httpResponse } from "../common/http.response";
import prisma from "../config/prisma.config";

export async function reporteProduccionServiceId(
  work_id: number,
  week?: string
) {
  try {
    // buscamos todos los trabajos con partes diarios

    console.log(work_id);

    const work = await prisma.trabajo.findFirst({
      where: {
        id: work_id,
      },
    });

    if (!work)
      return httpResponse.NotFoundException("No se encontro el trabajo");

    const trabajoPartida = await prisma.detalleTrabajoPartida.findMany({
      where: {
        trabajo_id: work_id,
      },
      include: {
        Partida: true,
      },
    });

    const response = await Promise.all(
      trabajoPartida.map(async (detalle) => {
        let cantidad_ejectuada = 0;

        const partida = detalle.Partida;

        const detail = await prisma.parteDiarioPartida.findMany({
          where: {
            partida_id: partida.id,
          },
        });

        detail.forEach((parte) => {
          if (parte.cantidad_utilizada) {
            cantidad_ejectuada += parte.cantidad_utilizada;
          }
        });

        return {
          partida: partida,
          metrado: detalle.Partida.metrado_inicial,
          cantidad_ejectuada: cantidad_ejectuada,
          restante: detalle.Partida.metrado_inicial - cantidad_ejectuada,
        };
      })
    );

    return httpResponse.SuccessResponse("reporte produccion", response);
  } catch (error) {
    return httpResponse.InternalServerErrorException(undefined, error);
  }
}

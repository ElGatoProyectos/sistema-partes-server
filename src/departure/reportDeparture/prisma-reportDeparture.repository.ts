import { ReportePartida } from "@prisma/client";
import { DepartureReportRepository } from "./reportDeparture.repository";
import prisma from "@/config/prisma.config";

class PrismaDepartureReportRepository implements DepartureReportRepository {
  async findById(departure_id: number): Promise<ReportePartida | null> {
    const departure = await prisma.reportePartida.findFirst({
      where: {
        partida_id: departure_id,
      },
    });
    return departure;
  }
}

export const prismaDepartureReportRepository =
  new PrismaDepartureReportRepository();

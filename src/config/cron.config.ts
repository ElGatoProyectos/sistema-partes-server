import { assistsWorkforceValidation } from "@/assists/assists.validation";
import { prismaAssistsRepository } from "@/assists/prisma-assists.repository";
import { detailWeekProjectValidation } from "@/week/detailWeekProject/detailWeekProject.validation";
import { weekValidation } from "@/week/week.validation";
import { prismaWorkforceRepository } from "@/workforce/prisma-workforce.repository";
import {
  DetalleSemanaProyecto,
  E_Asistencia_BD,
  E_Estado_BD,
  Semana,
} from "@prisma/client";
import cron from "node-cron";
import prisma from "./prisma.config";

export async function automaticTask() {
  try {
    cron.schedule(
      "00 59 23 * * 7",
      async () => {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        const dateWeekResponse = await weekValidation.findByDate(date);
        if (dateWeekResponse.success) {
          const dateWeek = dateWeekResponse.payload as Semana;
          const detailsResponse =
            await detailWeekProjectValidation.findAllForYear(date);
          if (detailsResponse.success) {
            const details = detailsResponse.payload as DetalleSemanaProyecto[];
            await detailWeekProjectValidation.updateProjectsForYear(
              details,
              dateWeek.id
            );
          }
        }
      },
      {
        scheduled: true,
        timezone: "America/Lima",
      }
    );
    cron.schedule(
      "00 00 05 * * 1-6",
      async () => {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        const workforces =
          await prismaWorkforceRepository.findAllWithoutPagination();
        const valueIsBetweenWeek = 8.5;
        const valueIsEndWeek = 5.5;
        const dayWeek = date.getUTCDay();
        const flag = dayWeek >= 1 && dayWeek <= 5;
        const value = flag === true ? valueIsBetweenWeek : valueIsEndWeek;
        const isDateResponse = await assistsWorkforceValidation.findByDate(
          date
        );
        if (!isDateResponse.success) {
          if (workforces) {
            const assistsPromises = workforces.map((workforce) => {
              const assistsFormat = {
                fecha: date,
                horas: value,
                horas_60: 0,
                horas_100: 0,
                asistencia: E_Asistencia_BD.F,
                horas_extras_estado: E_Estado_BD.n,
                mano_obra_id: workforce.id,
                proyecto_id: workforce.proyecto_id,
              };

              return prismaAssistsRepository.createAssists(assistsFormat);
            });
            await Promise.all(assistsPromises);
          }
        }
      },
      {
        scheduled: true,
        timezone: "America/Lima",
      }
    );
  } catch (error) {
    console.log("Error en la inserción del cron");
  } finally {
    await prisma.$disconnect();
  }
}

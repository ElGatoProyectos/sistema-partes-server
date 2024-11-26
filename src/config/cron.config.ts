import { assistsWorkforceValidation } from "../assists/assists.validation";
import { prismaAssistsRepository } from "../assists/prisma-assists.repository";
import { detailWeekProjectValidation } from "../week/detailWeekProject/detailWeekProject.validation";
import { weekValidation } from "../week/week.validation";
import { prismaWorkforceRepository } from "../workforce/prisma-workforce.repository";
import {
  Asistencia,
  DetalleSemanaProyecto,
  E_Asistencia_BD,
  E_Estado_BD,
  Proyecto,
  Semana,
} from "@prisma/client";
import cron from "node-cron";
import prisma from "./prisma.config";
import { projectValidation } from "../project/project.validation";
import { workforceValidation } from "../workforce/workforce.validation";

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
    //"00 00 05 * * 1-6"
    cron.schedule(
      "00 00 05 * * 1-6",
      async () => {
        const date = new Date();
        date.setUTCHours(0,0,0,0);
        const valueIsBetweenWeek = 8.5;
        const valueIsEndWeek = 5.5;
        const dayWeek = date.getUTCDay();
        const flag = dayWeek >= 1 && dayWeek <= 5;
        const value = flag === true ? valueIsBetweenWeek : valueIsEndWeek;
        const projectsResponse =
          await projectValidation.findAllWithOutPagination();
        const projects = projectsResponse.payload as Proyecto[];
        const assistsResponse =
          await assistsWorkforceValidation.findAllWithOutPaginationByDate(date);
        const asssits = assistsResponse.payload as Asistencia[];

        const projectsNotInAssists = projects.filter(
          (project) =>
            !asssits.some((assist) => assist.proyecto_id === project.id)
        );

        for (const project of projectsNotInAssists) {
          const workforcesResponse = await workforceValidation.findAllWithoutPaginationForProject(project.id);
          if(workforcesResponse && workforcesResponse?.length>0){

            const data = workforcesResponse.map((workforce) => ({
              fecha: date,
              horas: value,
              hora_parcial: 0,
              hora_normal: 0,
              horas_trabajadas: 0,
              horas_60: 0,
              horas_100: 0,
              asistencia: E_Asistencia_BD.F,
              horas_extras_estado: E_Estado_BD.n,
              mano_obra_id: workforce.id,
              proyecto_id: project.id,
            }));
        
            await prisma.asistencia.createMany({
              data: data,
            });
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
// cron.schedule(
//   "00 00 05 * * 1-6",
//   async () => {
//     const date = new Date();
//     const newDate = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
//     const workforces =
//       await prismaWorkforceRepository.findAllWithoutPagination();
//     const valueIsBetweenWeek = 8.5;
//     const valueIsEndWeek = 5.5;
//     const dayWeek = date.getUTCDay();
//     const flag = dayWeek >= 1 && dayWeek <= 5;
//     const value = flag === true ? valueIsBetweenWeek : valueIsEndWeek;
//     const isDateResponse = await assistsWorkforceValidation.findByDate(
//       date
//     );
//     if (!isDateResponse.success) {
//       if (workforces) {
//         const assistsPromises = workforces.map((workforce) => {
//           const assistsFormat = {
//             fecha: newDate,
//             horas: value,
//             hora_parcial: 0,
//             hora_normal: 0,
//             horas_trabajadas: 0,
//             horas_60: 0,
//             horas_100: 0,
//             asistencia: E_Asistencia_BD.F,
//             horas_extras_estado: E_Estado_BD.n,
//             mano_obra_id: workforce.id,
//             proyecto_id: workforce.proyecto_id,
//           };
//           return prismaAssistsRepository.createAssists(assistsFormat);
//         });
//         await Promise.all(assistsPromises);
//       }
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "America/Lima",
//   }
// );

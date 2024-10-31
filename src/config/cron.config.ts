import { detailWeekProjectValidation } from "@/week/detailWeekProject/detailWeekProject.validation";
import { weekValidation } from "@/week/week.validation";
import { DetalleSemanaProyecto, Semana } from "@prisma/client";
import cron from "node-cron";

export function automaticTask() {
  // cron.schedule(
  //   "00 59 23 * * 7",
  //   async () => {
  //     const date = new Date();
  //     date.setUTCHours(0, 0, 0, 0);
  //     const dateWeekResponse = await weekValidation.findByDate(date);
  //     if (dateWeekResponse.success) {
  //       const dateWeek = dateWeekResponse.payload as Semana;
  //       const detailsResponse =
  //         await detailWeekProjectValidation.findAllForYear(date);
  //       if (detailsResponse.success) {
  //         const details = detailsResponse.payload as DetalleSemanaProyecto[];
  //         await detailWeekProjectValidation.updateProjectsForYear(
  //           details,
  //           dateWeek.id
  //         );
  //       }
  //     }
  //   },
  //   {
  //     scheduled: true,
  //     timezone: "America/Lima",
  //   }
  // );
}

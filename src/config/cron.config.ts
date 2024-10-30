import { detailWeekProjectValidation } from "@/week/detailWeekProject/detailWeekProject.validation";
import { weekValidation } from "@/week/week.validation";
import { Semana } from "@prisma/client";
import cron from "node-cron";

export function automaticTask() {
  cron.schedule("* * * * *", async () => {
    const date = new Date();
    // const dateWeekResponse = await weekValidation.findByDate(date);
    // const dateWeek = dateWeekResponse.payload as Semana;
    // const detailResponse = await detailWeekProjectValidation.findByIdWeek(
    //   dateWeek.id
    // );
    // const train = await trainValidation.IsLastId(1);
    // console.log(train);
    // const details = await detailWeekProjectValidation.findAllForYear(date);
    // console.log(details);
  });
}

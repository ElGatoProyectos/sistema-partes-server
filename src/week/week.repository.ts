import { date } from "zod";
export abstract class WeekRepository {
  createUnit(
    weekNumber: string,
    currentStartDate: Date,
    currentEndDate: Date
  ): void {}
  findByDate(year: number): void {}
  findLastWeek(): void {}
  findForDate(date: Date): void {}
}

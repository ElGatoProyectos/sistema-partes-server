export abstract class WeekRepository {
  createWeek(
    weekNumber: string,
    currentStartDate: Date,
    currentEndDate: Date
  ): void {}
  findByDate(year: number): void {}
  findLastWeek(): void {}
  findForDate(date: Date): void {}
  findByCode(code: string): void {}
  findAllForYear(year: number): void {}
}

export abstract class WeekRepository {
  createUnit(
    weekNumber: number,
    currentStartDate: Date,
    currentEndDate: Date
  ): void {}
}

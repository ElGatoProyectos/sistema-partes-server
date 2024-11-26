import {
  I_CreateDetailWeekProject,
  I_UpdateDetailWeekProject,
} from "./models/detailWeekProject.interface";

export abstract class DetailWeekProjectRepository {
  createDetail(data: I_CreateDetailWeekProject): void {}

  findByIdProject(project_id: number): void {}

  findAll(project_id: number): void {}

  findIdWeek(week_id: number): void {}

  updateDetailMany(data: I_UpdateDetailWeekProject[], week: number): void {}

  findAllForYear(date: Date): void {}

  findByDateAndProject(date:Date,project_id:number):void{}
}

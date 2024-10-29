import { I_CreateDetailWeekProject } from "./models/detailWeekProject.interface";

export abstract class DetailWeekProjectRepository {
  createDetail(data: I_CreateDetailWeekProject): void {}

  findByIdProject(project_id: number): void {}

  findAll(project_id: number): void {}
}

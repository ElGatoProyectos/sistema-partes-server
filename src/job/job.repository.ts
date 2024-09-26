import { I_CreateJobBD, I_UpdateJobBody } from "./models/job.interface";

export abstract class JobRepository {
  findAll(skip: number, limit: number, project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUser: number): void {}

  createJob(data: I_CreateJobBD): void {}

  existsName(name: string, project_id: number): void {}

  updateJob(data: I_UpdateJobBody): void {}

  updateStatusJob(idUser: number): void {}

  searchNameJob(
    name: string,
    skip: number,
    limit: number,
    project_id: number
  ): void {}

  codeMoreHigh(project_id: number): void {}
}

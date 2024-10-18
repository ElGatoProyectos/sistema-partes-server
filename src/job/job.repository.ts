import { I_CreateJobBD, I_UpdateJobBD } from "./models/job.interface";
import { T_FindAllJob } from "./models/job.types";

export abstract class JobRepository {
  findAll(skip: number, data: T_FindAllJob, project_id: number): void {}

  findByCode(code: string, project_id: number): void {}

  findById(idUser: number): void {}

  createJob(data: I_CreateJobBD): void {}

  existsName(name: string, project_id: number): void {}

  updateJob(data: I_UpdateJobBD, job_id: number): void {}

  updateJobFromExcel(data: I_UpdateJobBD, job_id: number): void {}

  updateStatusJob(idUser: number): void {}

  codeMoreHigh(project_id: number): void {}

  findByJobForTrain(train_id: number): void {}
}

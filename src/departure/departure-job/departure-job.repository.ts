import { T_FindAllDepartureJob } from "./models/departure-job.types";

export abstract class DepartureJobRepository {
  createDetailDepartureJob(
    job_id: number,
    departure_Id: number,
    metrado: number
  ): void {}
  findAll(skip: number, data: T_FindAllDepartureJob): void {}
}

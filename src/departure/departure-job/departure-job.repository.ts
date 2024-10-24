import { T_FindAllDepartureJob } from "./models/departure-job.types";

export abstract class DepartureJobRepository {
  createDetailDepartureJob(
    job_id: number,
    departure_Id: number,
    metrado: number
  ): void {}
  updateDetailDepartureJob(
    detail_id: number,
    departure_Id: number,
    metrado: number
  ): void {}
  findAll(skip: number, data: T_FindAllDepartureJob): void {}
  deleteDetailDepartureJob(detail_id: number): void {}
  findById(detail_id: number): void {}
  findByIdJob(job_id: number): void {}
  findByIdDeparture(departure_id: number): void {}
  findByIdDepartureAndIdJob(departure_id: number, job_id: number): void {}
}

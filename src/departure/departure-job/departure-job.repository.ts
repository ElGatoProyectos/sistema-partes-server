import {
  T_FindAllDepartureJob,
  T_FindAllWork,
} from "./models/departure-job.types";

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
  findAllWithOutPagination(project_id: number): void {}
  findAllWithPaginationForJob(
    skip: number,
    data: T_FindAllDepartureJob,
    project_id: number
  ): void {}
  findAllForJob(
    skip: number,
    data: T_FindAllWork,
    project_id: number,
    job_id: number
  ): void {}
  findAllWithPaginationForDetail(
    skip: number,
    data: T_FindAllDepartureJob,
    project_id: number
  ): void {}
  deleteDetailDepartureJob(detail_id: number): void {}
  findById(detail_id: number): void {}
  findByIdJob(job_id: number): void {}
  findByIdDeparture(departure_id: number): void {}
  findByIdDepartureAndIdJob(departure_id: number, job_id: number): void {}
}

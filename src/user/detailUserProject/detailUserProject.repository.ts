import { I_CreateDetailUserProject } from "./models/detailUserProject.interface";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";

export abstract class DetailUserProjectRepository {
  createUserProject(data: I_CreateDetailUserProject): void {}
  getAllUsersOfProject(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number,
    user_id: number,
    nameRol: string
  ): void {}
  getAllUsersOfProjectUnassigned(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number
  ): void {}
  deleteUserByDetail(detailUserProject: number): void {}
  findByUser(user_id: number, project: number): void {}
}

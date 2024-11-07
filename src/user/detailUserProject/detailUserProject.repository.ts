import { T_FindAllProject } from "../../project/dto/project.type";
import { I_CreateDetailUserProject } from "./models/detailUserProject.interface";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";

export abstract class DetailUserProjectRepository {
  createUserProject(data: I_CreateDetailUserProject): void {}
  getAllProjectsOfUser(
    company_id: number,
    data: T_FindAllProject,
    skip: number
  ): void {}
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
  getAllResponsible(project_id: number): void {}
  deleteUserByDetail(detailUserProject: number): void {}
  findByUser(user_id: number, project: number): void {}
  existsUser(user_id: number): void {}
}

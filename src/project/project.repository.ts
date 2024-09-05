import {
  I_CreateProjectBD,
  I_UpdateProyectBody,
} from "./models/project.interface";

export abstract class ProjectRepository {
  createProject(data: I_CreateProjectBD): void {}
  updateProject(data: I_UpdateProyectBody, idProject: number): void {}
  findById(idProject: number): void {}
  updateStatusProject(idProject: number): void {}
  allProjectsuser(idUser: number, skip: number, limit: number): void {}
  searchNameProject(name: string, skip: number, limit: number): void {}
}

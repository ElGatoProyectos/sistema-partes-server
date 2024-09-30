import { E_Proyecto_Estado } from "@prisma/client";
import { T_FindAllProject } from "./dto/project.type";
import {
  I_CreateProjectBD,
  I_UpdateColorsProject,
  I_UpdateProjectState,
  I_UpdateProyectBody,
} from "./models/project.interface";

export abstract class ProjectRepository {
  createProject(data: I_CreateProjectBD): void {}
  updateProject(data: I_UpdateProyectBody, idProject: number): void {}
  findById(idProject: number): void {}
  updateStatusProject(idProject: number): void {}
  allProjectsuser(
    company_id: number,
    data: T_FindAllProject,
    skip: number
  ): void {}
  searchNameProject(data: T_FindAllProject, skip: number): void {}
  updateStateProject(
    idProject: number,
    stateProject: E_Proyecto_Estado
  ): void {}
  codeMoreHigh(company_id: number): void {}
  updateColorsProject(project_id: number, data: I_UpdateColorsProject): void {}
  totalProjectsByCompany(company_id: number): void {}
}

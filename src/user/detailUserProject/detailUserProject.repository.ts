import { I_CreateDetailUserProject } from "./models/detailUserProject.interface";

export abstract class DetailUserProjectRepository {
  createUserProject(data: I_CreateDetailUserProject): void {}
}

import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";

export abstract class DetailMasterBuilderForemanRepository {
  getAllDetailMasterBuilderForeman(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number,
    user_id: number
  ): void {}
  createDetailMasterBuilderForeman(
    user_id: number,
    user2_id: number,
    project_id: number
  ): void {}
  verifyIdDetailMasterBuilderForeman(user_id: number): void {}
}

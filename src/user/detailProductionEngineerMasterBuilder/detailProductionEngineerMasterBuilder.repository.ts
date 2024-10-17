import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";

export abstract class DetailProductionEngineerMasterBuilder {
  createDetailProductionEngineerMasterBuilder(
    user_id: number,
    user2_id: number,
    project_id: number
  ): void {}
  verifyIdDetailProductionEngineerMasterBuilder(user_id: number): void {}
  getAllDetailProductionEngineerMasterBuilder(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number,
    user_id: number
  ): void {}
  deleteDetail(detail_id: number): void {}

  findByIdMasterBuilder(masterBuilder_id: number, project_id: number): void {}
}

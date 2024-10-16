import { T_FindAllDetailProductionEngineerMasterBuilder } from "./models/detailProductionEngineerMasterBuilder.types";

export abstract class DetailProductionEngineerMasterBuilder {
  createDetailProductionEngineerMasterBuilder(
    user_id: number,
    user2_id: number,
    project_id: number
  ): void {}
  verifyIdDetailProductionEngineerMasterBuilder(user_id: number): void {}
  getAllDetailProductionEngineerMasterBuilder(
    data: T_FindAllDetailProductionEngineerMasterBuilder,
    project_id: number
  ): void {}
}

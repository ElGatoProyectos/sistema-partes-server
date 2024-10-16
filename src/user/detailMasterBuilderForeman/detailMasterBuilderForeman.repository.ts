import { T_FindAllDetailMasterBuilderForeman } from "./models/detailMasterBuilderForeman.types";

export abstract class DetailMasterBuilderForemanRepository {
  getAllDetailMasterBuilderForeman(
    data: T_FindAllDetailMasterBuilderForeman,
    project_id: number
  ): void {}
  createDetailMasterBuilderForeman(
    user_id: number,
    user2_id: number,
    project_id: number
  ): void {}
  verifyIdDetailMasterBuilderForeman(user_id: number): void {}
}

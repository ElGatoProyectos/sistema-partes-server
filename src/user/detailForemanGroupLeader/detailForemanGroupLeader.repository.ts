import { T_FindAllDetailForemanGroupLeader } from "./models/detailForemanGroupLeader.types";

export abstract class DetailForemanGroupLeaderRepository {
  getAllDetailForemanGroupLeader(
    skip: number,
    data: T_FindAllDetailForemanGroupLeader,
    project_id: number
  ): void {}

  createDetailForemanGroupLeader(
    user_id: number,
    user2_id: number,
    project_id: number
  ): void {}
  verifyIdDetailForemanGroupLeader(user_id: number): void {}
}

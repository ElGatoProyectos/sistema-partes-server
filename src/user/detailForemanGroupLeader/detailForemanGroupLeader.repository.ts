import { T_FindAllDetailUserProject } from "../detailUserProject/models/detailUserProject.types";

export abstract class DetailForemanGroupLeaderRepository {
  getAllDetailForemanGroupLeader(
    skip: number,
    data: T_FindAllDetailUserProject,
    project_id: number,
    user_id: number
  ): void {}

  createDetailForemanGroupLeader(
    user_id: number,
    user2_id: number,
    project_id: number
  ): void {}
  verifyIdDetailForemanGroupLeader(user_id: number): void {}
}

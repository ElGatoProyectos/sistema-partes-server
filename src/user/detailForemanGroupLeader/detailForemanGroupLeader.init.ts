import express from "@/config/express.config";
import { detailForemanGroupLeaderController } from "./detailForemanGroupLeader.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { userMiddleware } from "../user.middleware";

const detailForemanGroupLeaderRouter = express.Router();
const prefix = "/capataz-jefe-grupo";

detailForemanGroupLeaderRouter.get(
  `${prefix}`,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailForemanGroupLeaderController.all
);

export default detailForemanGroupLeaderRouter;

import express from "../../config/express.config";
import { detailForemanGroupLeaderController } from "./detailForemanGroupLeader.controller";
import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import { detailForemanGroupLeaderMiddleware } from "./detailForemanGroupLeader.middleware";

const detailForemanGroupLeaderRouter = express.Router();
const prefix = "/capataz-jefe-grupo";

detailForemanGroupLeaderRouter.get(
  `${prefix}/:id`,
  detailForemanGroupLeaderMiddleware.verifyHeadersFieldsId,
  detailForemanGroupLeaderMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailForemanGroupLeaderController.all
);

export default detailForemanGroupLeaderRouter;

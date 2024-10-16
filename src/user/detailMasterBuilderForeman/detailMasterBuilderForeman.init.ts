import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { userMiddleware } from "../user.middleware";
import { detailMasterBuilderForemanController } from "./detailMasterBuilderForeman.controller";

const detailMasterBuilderForemanRouter = express.Router();
const prefix = "/maestro-obra-capataz";

detailMasterBuilderForemanRouter.get(
  `${prefix}`,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailMasterBuilderForemanController.all
);

export default detailMasterBuilderForemanRouter;

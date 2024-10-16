import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { userMiddleware } from "../user.middleware";
import { detailProductionEngineerMasterBuilderController } from "./detailProductionEngineerMasterBuilder.controller";

const detailProductionEngineerMasterBuilderRouter = express.Router();
const prefix = "/ingeniero-produccion-maestro-obra";

detailProductionEngineerMasterBuilderRouter.get(
  `${prefix}`,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailProductionEngineerMasterBuilderController.all
);

export default detailProductionEngineerMasterBuilderRouter;

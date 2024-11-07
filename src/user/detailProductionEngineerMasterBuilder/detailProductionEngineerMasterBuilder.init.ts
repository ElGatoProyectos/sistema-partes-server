import express from "../../config/express.config";
import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import { detailProductionEngineerMasterBuilderController } from "./detailProductionEngineerMasterBuilder.controller";
import { detailProductionEngineerMasterBuilderMiddleware } from "./detailProductionEngineerMasterBuilder.middleware";

const detailProductionEngineerMasterBuilderRouter = express.Router();
const prefix = "/ingeniero-produccion-maestro-obra";

detailProductionEngineerMasterBuilderRouter.get(
  `${prefix}/:id`,
  detailProductionEngineerMasterBuilderMiddleware.verifyHeadersFieldsId,
  detailProductionEngineerMasterBuilderMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailProductionEngineerMasterBuilderController.all
);

export default detailProductionEngineerMasterBuilderRouter;

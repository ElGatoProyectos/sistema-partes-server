import express from "../../config/express.config";
import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import { userMiddleware } from "../user.middleware";
import { detailMasterBuilderForemanController } from "./detailMasterBuilderForeman.controller";
import { detailMasterBuilderForemanMiddleware } from "./detailMasterBuilderForeman.middleware";

const detailMasterBuilderForemanRouter = express.Router();
const prefix = "/maestro-obra-capataz";

detailMasterBuilderForemanRouter.get(
  `${prefix}/:id`,
  detailMasterBuilderForemanMiddleware.verifyHeadersFieldsId,
  detailMasterBuilderForemanMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailMasterBuilderForemanController.all
);

export default detailMasterBuilderForemanRouter;

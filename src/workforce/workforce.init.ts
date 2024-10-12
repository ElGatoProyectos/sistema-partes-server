import express from "@/config/express.config";
import { workforceMiddleware } from "./workforce.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { workforceController } from "./workforce.controller";

const workforceRouter = express.Router();
const prefix = "/mano-de-obra";

workforceRouter.post(
  `${prefix}/upload-excel`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  workforceController.workforceReadExcel
);

workforceRouter.get(
  `${prefix}`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  workforceController.allWorkforce
);

export default workforceRouter;

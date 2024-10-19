import express from "@/config/express.config";
import { workforceMiddleware } from "./workforce.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { workforceController } from "./workforce.controller";

const workforceRouter = express.Router();
const prefix = "/mano-de-obra";

workforceRouter.post(
  `${prefix}`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  workforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  workforceController.create
);
workforceRouter.put(
  `${prefix}/:id`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  workforceMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminUser,
  workforceController.update
);
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

workforceRouter.get(
  `${prefix}/excel`,
  // workforceMiddleware.verifyHeadersFieldsIdProject,
  // authRoleMiddleware.authAdminUser,
  workforceController.exportExcel
);

workforceRouter.delete(
  `${prefix}/:id`,
  workforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  workforceController.updateStatus
);

export default workforceRouter;

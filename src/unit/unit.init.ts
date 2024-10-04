import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { unitController } from "./unit.controller";
import { unitMiddleware } from "./unit.middleware";

const unitRouter = express.Router();

const prefix = "/unit";

unitRouter.get(
  `${prefix}/:project_id`,
  unitMiddleware.verifyHeadersFieldsProject,
  authRoleMiddleware.authAdminUser,
  unitController.allResoursesCategories
);

unitRouter.get(
  `${prefix}/search/:project_id`,
  unitMiddleware.verifyHeadersFieldsProject,
  authRoleMiddleware.authAdminUser,
  unitController.findByName
);

unitRouter.delete(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  unitController.updateStatus
);

unitRouter.get(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  unitController.findByIdUnit
);

unitRouter.post(
  `${prefix}/project/:project_id`,
  unitMiddleware.verifyHeadersFieldsProject,
  unitMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdminUser,
  unitController.create
);

unitRouter.put(
  `${prefix}/:id/project/:project_id`,
  unitMiddleware.verifyHeadersFieldsId,
  unitMiddleware.verifyHeadersFieldsProject,
  unitMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminUser,
  unitController.update
);

export default unitRouter;

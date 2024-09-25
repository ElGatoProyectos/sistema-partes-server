import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";
import { unitController } from "./unit.controller";
import { unitMiddleware } from "./unit.middleware";

const unitRouter = express.Router();

const prefix = "/unit";

unitRouter.get(
  `${prefix}/:project_id`,
  unitMiddleware.verifyHeadersFieldsProject,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.allResoursesCategories
);

unitRouter.get(
  `${prefix}/search/:project_id`,
  unitMiddleware.verifyHeadersFieldsProject,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.findByName
);
unitRouter.delete(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.updateStatus
);

unitRouter.get(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.findByIdUnit
);

unitRouter.post(
  `${prefix}/project/:project_id`,
  unitMiddleware.verifyHeadersFieldsProject,
  unitMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.create
);

unitRouter.put(
  `${prefix}/:id/project/:project_id`,
  unitMiddleware.verifyHeadersFieldsId,
  unitMiddleware.verifyHeadersFieldsProject,
  unitMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.update
);

export default unitRouter;

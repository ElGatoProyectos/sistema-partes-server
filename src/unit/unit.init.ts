import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";
import { unitController } from "./unit.controller";
import { unitMiddleware } from "./unit.middleware";

const unitRouter = express.Router();

const prefix = "/unit";

unitRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.allResoursesCategories
);

unitRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.findByName
);
unitRouter.delete(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.updateStatus
);

unitRouter.get(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.findByIdUnit
);

unitRouter.post(
  `${prefix}`,
  unitMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.create
);

unitRouter.put(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFields,
  unitMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndProjectManager,
  unitController.update
);

export default unitRouter;

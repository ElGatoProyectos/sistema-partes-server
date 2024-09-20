import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import express from "@/config/express.config";
import { unifiedIndexController } from "./unifiedIndex.controller";
import { unifiedIndexMiddleware } from "./unifiedIndex.middleware";

const unifiedIndexRouter = express.Router();

const prefix = "/unified-index";

unifiedIndexRouter.post(
  `${prefix}`,
  unifiedIndexMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdmin,
  unifiedIndexController.create
);

unifiedIndexRouter.post(
  `${prefix}/upload-excel/company/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  unifiedIndexController.unifiedIndexReadExcel
);

unifiedIndexRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminAndProjectManager,
  unifiedIndexController.allUnifiedIndex
);

unifiedIndexRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdmin,
  unifiedIndexController.findByName
);

unifiedIndexRouter.get(
  `${prefix}/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdmin,
  unifiedIndexController.findByIdUnifiedIndex
);

unifiedIndexRouter.put(
  `${prefix}/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  unifiedIndexMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndProjectManager,
  unifiedIndexController.update
);

unifiedIndexRouter.delete(
  `${prefix}/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  unifiedIndexController.updateStatus
);

export default unifiedIndexRouter;

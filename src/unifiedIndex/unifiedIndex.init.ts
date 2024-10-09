import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import express from "@/config/express.config";
import { unifiedIndexController } from "./unifiedIndex.controller";
import { unifiedIndexMiddleware } from "./unifiedIndex.middleware";

const unifiedIndexRouter = express.Router();

const prefix = "/unified-index";

unifiedIndexRouter.post(
  `${prefix}`,
  unifiedIndexMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdminUser,
  unifiedIndexController.create
);

unifiedIndexRouter.post(
  `${prefix}/upload-excel/company/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminUser,
  unifiedIndexController.unifiedIndexReadExcel
);

unifiedIndexRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminUser,
  unifiedIndexController.allUnifiedIndex
);

unifiedIndexRouter.get(
  `${prefix}/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminUser,
  unifiedIndexController.findByIdUnifiedIndex
);

unifiedIndexRouter.put(
  `${prefix}/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  unifiedIndexMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminUser,
  unifiedIndexController.update
);

unifiedIndexRouter.delete(
  `${prefix}/:id`,
  unifiedIndexMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminUser,
  unifiedIndexController.updateStatus
);

export default unifiedIndexRouter;

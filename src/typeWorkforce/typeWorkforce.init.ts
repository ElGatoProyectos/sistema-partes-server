import express from "@/config/express.config";
import { typeWorkforceController } from "./typeWorkforce.controller";
import { typeWorkforceMiddleware } from "./typeWorkforce.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const typeWorkforce = express.Router();
const prefix = "/type-workforce";

typeWorkforce.post(
  `${prefix}`,
  typeWorkforceMiddleware.verifyHeadersFieldsIdProject,
  typeWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  typeWorkforceController.create
);
typeWorkforce.put(
  `${prefix}/:id`,
  typeWorkforceMiddleware.verifyHeadersFieldsId,
  typeWorkforceMiddleware.verifyHeadersFieldsIdProject,
  typeWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  typeWorkforceController.update
);
typeWorkforce.delete(
  `${prefix}/:id`,
  typeWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  typeWorkforceController.updateStatus
);
typeWorkforce.get(
  `${prefix}`,
  authRoleMiddleware.authAdminUser,
  typeWorkforceController.all
);

export default typeWorkforce;

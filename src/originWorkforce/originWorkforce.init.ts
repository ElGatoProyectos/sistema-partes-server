import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { originWorkforceMiddleware } from "./originWorkforce.middleware";
import { originWorkforceController } from "./originWorkforce.controller";

const originWorkforce = express.Router();
const prefix = "/origin-workforce";

originWorkforce.post(
  `${prefix}`,
  originWorkforceMiddleware.verifyHeadersFieldsIdProject,
  originWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  originWorkforceController.create
);
originWorkforce.put(
  `${prefix}/:id`,
  originWorkforceMiddleware.verifyHeadersFieldsId,
  originWorkforceMiddleware.verifyHeadersFieldsIdProject,
  originWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  originWorkforceController.update
);
originWorkforce.delete(
  `${prefix}/:id`,
  originWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  originWorkforceController.updateStatus
);
originWorkforce.get(
  `${prefix}`,
  originWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  originWorkforceController.all
);
originWorkforce.get(
  `${prefix}/:id`,
  originWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  originWorkforceController.findByIdOrigin
);

export default originWorkforce;

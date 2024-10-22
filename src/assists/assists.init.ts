import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { assistsController } from "./assists.controller";
import { assistsWorkforceMiddleware } from "./assists.middleware";

const assistsWorkforce = express.Router();
const prefix = "/assists";

assistsWorkforce.post(
  `${prefix}`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  assistsController.create
);
assistsWorkforce.get(
  `${prefix}`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  assistsController.getAll
);

assistsWorkforce.get(
  `${prefix}/:id`,
  assistsWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  assistsController.findById
);

export default assistsWorkforce;

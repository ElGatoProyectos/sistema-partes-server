import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { assistsController } from "./assists.controller";
import { assistsWorkforceMiddleware } from "./assists.middleware";

const assistsWorkforce = express.Router();
const prefix = "/assists";

assistsWorkforce.post(
  `${prefix}`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  assistsWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  assistsController.create
);

export default assistsWorkforce;

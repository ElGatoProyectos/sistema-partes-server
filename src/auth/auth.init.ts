//aca rutas

import express from "../config/express.config";
import { loginMiddleware } from "./middlewares/login.middleware";
import { authRoleMiddleware } from "./middlewares/auth-role.middleware";
import { authController } from "./auth.controller";

const authRouter = express.Router();

const prefix = "/auth";

authRouter.post(
  `${prefix}/login`,
  loginMiddleware.validateBody,
  authController.login
  //authRoleMiddleware.authAdmin
);

authRouter.get(`${prefix}/me`, authController.me);

export default authRouter;

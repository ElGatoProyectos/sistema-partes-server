//aca rutas

import express from "@/config/express.config";
import { loginMiddleware } from "./middlewares/login.middleware";
import { authRoleMiddleware } from "./middlewares/auth-role.middleware";

const authRouter = express.Router();

const prefix = "/auth";

authRouter.post(
  `${prefix}`,
  loginMiddleware.validateBody,
  authRoleMiddleware.authAdmin
);

authRouter.post(
  `${prefix}`,
  loginMiddleware.validateBody,
  authRoleMiddleware.authUser
);

import express from "@/config/express.config";
import { userMiddleware } from "./user.middleware";
import { userController } from "./user.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const userRouter = express.Router();

const prefix = "/users";

userRouter.post(
  `${prefix}`,
  userMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdmin,
  userController.create
);

export default userRouter;

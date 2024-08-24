import express from "@/config/express.config";
import { userMiddleware } from "./user.middleware";
import { userController } from "./user.controller";

const userRouter = express.Router();

const prefix = "/user";

userRouter.post(
  `${prefix}`,
  userMiddleware.verifyFieldsRegistry,
  userController.create
);

export default userRouter;

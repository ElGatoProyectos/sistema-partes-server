import express from "@/config/express.config";
import { userMiddleware } from "./user.middleware";
import { userController } from "./user.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { headerDto } from "./dto/header.params.dto";
import { requestMiddleware } from "@/common/middlewares/request.middleware";

const userRouter = express.Router();

const prefix = "/users";

userRouter.get(
  `${prefix}`,
  requestMiddleware.validatePagination,
  // authRoleMiddleware.authAdmin,
  userController.allUsers
);

userRouter.post(
  `${prefix}`,
  userMiddleware.verifyFieldsRegistry,
  // authRoleMiddleware.authAdmin,
  userController.create
);

userRouter.put(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFields,
  userMiddleware.verifyFieldsUpdate,
  //authRoleMiddleware.authAdmin,
  userController.update
);

userRouter.delete(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFields,
  //authRoleMiddleware.authAdmin,
  userController.updateStatus
);

export default userRouter;

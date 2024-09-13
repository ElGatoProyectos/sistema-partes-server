import express from "@/config/express.config";
import { userMiddleware } from "./user.middleware";
import { userController } from "./user.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";

const userRouter = express.Router();

const prefix = "/users";

userRouter.get(
  `${prefix}`,
  requestMiddleware.validatePagination,
  authRoleMiddleware.authAdmin,
  userController.allUsers
);

userRouter.get(
  `${prefix}/search`,
  requestMiddleware.validatePagination,
  authRoleMiddleware.authAdmin,
  userController.findByName
);

userRouter.get(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdmin,
  userController.findByIdUser
);

userRouter.post(
  `${prefix}`,
  userMiddleware.verifyFieldsRegistry,
  // authRoleMiddleware.authAdmin,
  userController.createUser
);

userRouter.post(
  `${prefix}/company`,
  authRoleMiddleware.authAdmin,
  userController.createUserandCompany
);

userRouter.post(
  `${prefix}/user`,
  userMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdmin,
  userController.createUserAndSearchToken
);

userRouter.put(
  `${prefix}/rol`,
  userMiddleware.verifyFieldsUpdateRol,
  authRoleMiddleware.authAdmin,
  userController.updateRol
);

userRouter.put(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFields,
  userMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdmin,
  userController.update
);

userRouter.delete(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdmin,
  userController.updateStatus
);

export default userRouter;

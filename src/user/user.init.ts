import express from "@/config/express.config";
import { userMiddleware } from "./user.middleware";
import { userController } from "./user.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";

const userRouter = express.Router();

const prefix = "/users";

userRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminAndProjectManagerAndUser,
  userController.allUsers
);

userRouter.get(
  `${prefix}/details_user_company/:id`,
  userMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndProjectManagerAndUser,
  userController.allUsersForCompany
);

userRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdmin,
  userController.findByName
);

userRouter.get(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdmin,
  userController.findByIdUser
);

userRouter.post(
  `${prefix}`,
  userMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  userController.createUserAndSearchToken //antes aca era create pero no te lo asignarba a una empresa
);

userRouter.post(
  `${prefix}/company`,
  authRoleMiddleware.authAdmin,
  userController.createUserandCompany
);
userRouter.put(
  `${prefix}/:id/company`,
  authRoleMiddleware.authAdmin,
  userController.updateUserandCompany
);

// userRouter.post(
//   `${prefix}/user`,
//   userMiddleware.verifyFieldsRegistry,
//   authRoleMiddleware.authAdminAndProjectManagerAndUser,
//   userController.createUserAndSearchToken
// );

userRouter.put(
  `${prefix}/users_project`,
  userMiddleware.verifyFieldsUpdateRol,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  userController.createDetailUserProjectandChangeRol
);

userRouter.put(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFieldsId,
  userMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  userController.update
);

userRouter.patch(
  `${prefix}/user/:id/rol/:rol_id/permissions`,
  userMiddleware.verifyHeadersFieldsId,
  userMiddleware.verifyHeadersFieldsRolId,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminAndCostControl,
  userController.createPermissions
);

userRouter.delete(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdmin,
  userController.updateStatus
);

export default userRouter;

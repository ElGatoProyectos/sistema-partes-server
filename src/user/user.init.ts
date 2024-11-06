import express from "../config/express.config";
import { userMiddleware } from "./user.middleware";
import { userController } from "./user.controller";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";

const userRouter = express.Router();

const prefix = "/users";

userRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminUser,
  userController.allUsers
);
userRouter.post(
  `${prefix}/company`,
  authRoleMiddleware.authAdminUser,
  userController.createUserandCompany
);
userRouter.get(
  `${prefix}/details_user_company/:id`,
  userMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  userController.allUsersForCompany
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
  authRoleMiddleware.authAdminUser,
  userController.createUserAndSearchToken //antes aca era create pero no te lo asignarba a una empresa
);

userRouter.put(
  `${prefix}/:id/company`,
  authRoleMiddleware.authAdminUser,
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
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "GERENTE_PROYECTO",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
  ]),
  userController.createDetailUserProjectandChangeRol
);

userRouter.put(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFieldsId,
  userMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminUser,
  userController.update
);

userRouter.patch(
  `${prefix}/user/:id/rol/:rol_id/permissions`,
  userMiddleware.verifyHeadersFieldsId,
  userMiddleware.verifyHeadersFieldsRolId,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  userController.createPermissions
);

userRouter.delete(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdmin,
  userController.updateStatus
);

export default userRouter;

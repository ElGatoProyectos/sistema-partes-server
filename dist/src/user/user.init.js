"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const user_middleware_1 = require("./user.middleware");
const user_controller_1 = require("./user.controller");
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const userRouter = express_config_1.default.Router();
const prefix = "/users";
userRouter.get(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManagerAndUser, user_controller_1.userController.allUsers);
userRouter.get(`${prefix}/detailsUserCompany/:id`, user_middleware_1.userMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManagerAndUser, user_controller_1.userController.allUsersForCompany);
userRouter.get(`${prefix}/search`, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.findByName);
userRouter.get(`${prefix}/:id`, user_middleware_1.userMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.findByIdUser);
userRouter.post(`${prefix}`, user_middleware_1.userMiddleware.verifyFieldsRegistry, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.createUserAndSearchToken //antes aca era create pero no te lo asignarba a una empresa
);
userRouter.post(`${prefix}/company`, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.createUserandCompany);
userRouter.put(`${prefix}/:id/company`, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.updateUserandCompany);
// userRouter.post(
//   `${prefix}/user`,
//   userMiddleware.verifyFieldsRegistry,
//   authRoleMiddleware.authAdminAndProjectManagerAndUser,
//   userController.createUserAndSearchToken
// );
userRouter.put(`${prefix}/rol`, user_middleware_1.userMiddleware.verifyFieldsUpdateRol, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.updateRol);
userRouter.put(`${prefix}/:id`, user_middleware_1.userMiddleware.verifyHeadersFieldsId, user_middleware_1.userMiddleware.verifyFieldsUpdate, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.update);
userRouter.patch(`${prefix}/user/:id/rol/:rol_id/project/:project_id/permissions`, user_middleware_1.userMiddleware.verifyHeadersFieldsId, user_middleware_1.userMiddleware.verifyHeadersFieldsRolId, user_middleware_1.userMiddleware.verifyHeadersFieldsProjectId, auth_role_middleware_1.authRoleMiddleware.authAdminAndCostControl, user_controller_1.userController.createPermissions);
userRouter.delete(`${prefix}/:id`, user_middleware_1.userMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdmin, user_controller_1.userController.updateStatus);
exports.default = userRouter;

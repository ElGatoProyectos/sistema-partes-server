"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const express_config_1 = __importDefault(require("@/config/express.config"));
const user_middleware_1 = require("../user.middleware");
const detailUserProject_controller_1 = require("./detailUserProject.controller");
const detailUserProjectRouter = express_config_1.default.Router();
const prefix = "/users_project";
detailUserProjectRouter.get(`${prefix}`, user_middleware_1.userMiddleware.verifyHeadersFieldsIdProjectHeader, auth_role_middleware_1.authRoleMiddleware.authAdminUser, detailUserProject_controller_1.detailUserProjectController.allUsersByProject);
detailUserProjectRouter.get(`${prefix}/unassigned`, user_middleware_1.userMiddleware.verifyHeadersFieldsIdProjectHeader, auth_role_middleware_1.authRoleMiddleware.authAdminUser, detailUserProject_controller_1.detailUserProjectController.allUsersByProjectUnassigned);
detailUserProjectRouter.delete(`${prefix}/:id`, user_middleware_1.userMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdminUser, detailUserProject_controller_1.detailUserProjectController.deleteUserFromProject);
exports.default = detailUserProjectRouter;

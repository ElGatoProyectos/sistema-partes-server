"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const rol_controller_1 = require("./rol.controller");
const rol_middleware_1 = require("./rol.middleware");
const rolRouter = express_config_1.default.Router();
const prefix = "/roles";
rolRouter.post(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdmin, rol_controller_1.rolController.create);
rolRouter.get(`${prefix}/:id`, rol_middleware_1.rolMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdminUser, rol_controller_1.rolController.findByIdRol);
rolRouter.get(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdminUser, rol_controller_1.rolController.allRoles);
exports.default = rolRouter;

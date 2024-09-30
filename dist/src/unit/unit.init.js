"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const unit_controller_1 = require("./unit.controller");
const unit_middleware_1 = require("./unit.middleware");
const unitRouter = express_config_1.default.Router();
const prefix = "/unit";
unitRouter.get(`${prefix}/:project_id`, unit_middleware_1.unitMiddleware.verifyHeadersFieldsProject, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unit_controller_1.unitController.allResoursesCategories);
unitRouter.get(`${prefix}/search/:project_id`, unit_middleware_1.unitMiddleware.verifyHeadersFieldsProject, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unit_controller_1.unitController.findByName);
unitRouter.delete(`${prefix}/:id`, unit_middleware_1.unitMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unit_controller_1.unitController.updateStatus);
unitRouter.get(`${prefix}/:id`, unit_middleware_1.unitMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unit_controller_1.unitController.findByIdUnit);
unitRouter.post(`${prefix}/project/:project_id`, unit_middleware_1.unitMiddleware.verifyHeadersFieldsProject, unit_middleware_1.unitMiddleware.verifyFieldsRegistry, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unit_controller_1.unitController.create);
unitRouter.put(`${prefix}/:id/project/:project_id`, unit_middleware_1.unitMiddleware.verifyHeadersFieldsId, unit_middleware_1.unitMiddleware.verifyHeadersFieldsProject, unit_middleware_1.unitMiddleware.verifyFieldsUpdate, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unit_controller_1.unitController.update);
exports.default = unitRouter;

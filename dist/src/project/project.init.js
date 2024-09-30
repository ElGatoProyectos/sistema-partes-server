"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const project_controller_1 = require("./project.controller");
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const project_middleware_1 = require("./project.middleware");
const projectRouter = express_config_1.default.Router();
const prefix = "/projects";
projectRouter.post(`${prefix}`, project_controller_1.projectController.create);
projectRouter.get(`${prefix}`, project_middleware_1.projectMiddleware.verifyFieldsUpdateState, auth_role_middleware_1.authRoleMiddleware.authViewAll, project_controller_1.projectController.findAllProjectsXCompany);
projectRouter.get(`${prefix}/search`, auth_role_middleware_1.authRoleMiddleware.authViewAll, project_controller_1.projectController.findByName);
//ojo!!!! lo q pongas abajo ya q cuando coloque el /search abajo no me funcionaba la ruta
projectRouter.get(`${prefix}/:id`, auth_role_middleware_1.authRoleMiddleware.authAdminAndCostControlAndUser, project_middleware_1.projectMiddleware.verifyHeadersFields, project_controller_1.projectController.findByIdProject);
projectRouter.get(`${prefix}/file/:id`, auth_role_middleware_1.authRoleMiddleware.authViewAll, project_middleware_1.projectMiddleware.verifyHeadersFields, project_controller_1.projectController.findImage);
projectRouter.put(`${prefix}/:id`, project_controller_1.projectController.updateProject);
projectRouter.patch(`${prefix}/:id`, project_middleware_1.projectMiddleware.verifyHeadersFields, project_middleware_1.projectMiddleware.verifyFieldsUpdateState, auth_role_middleware_1.authRoleMiddleware.authAdminAndCostControlAndUser, project_controller_1.projectController.updateState);
projectRouter.delete(`${prefix}/:id`, auth_role_middleware_1.authRoleMiddleware.authAdminAndCostControlAndUser, project_middleware_1.projectMiddleware.verifyHeadersFields, project_controller_1.projectController.updateStatus);
exports.default = projectRouter;

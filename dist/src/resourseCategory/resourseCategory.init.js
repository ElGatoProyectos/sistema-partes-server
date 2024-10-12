"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const resourseCategory_controller_1 = require("./resourseCategory.controller");
const resourseCategory_middleware_1 = require("./resourseCategory.middleware");
const resourseCategoryRouter = express_config_1.default.Router();
const prefix = "/resourseCategory";
resourseCategoryRouter.get(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdminUser, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyHeadersFieldsIdProject, resourseCategory_controller_1.resourseCategoryController.allResoursesCategories);
resourseCategoryRouter.get(`${prefix}/search`, auth_role_middleware_1.authRoleMiddleware.authAdminUser, resourseCategory_controller_1.resourseCategoryController.findByName);
resourseCategoryRouter.get(`${prefix}/:id`, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdminUser, resourseCategory_controller_1.resourseCategoryController.findByIdResourseCategory);
resourseCategoryRouter.post(`${prefix}`, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyFieldsRegistry, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyHeadersFieldsIdProject, auth_role_middleware_1.authRoleMiddleware.authAdminUser, resourseCategory_controller_1.resourseCategoryController.create);
resourseCategoryRouter.put(`${prefix}/:id`, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyHeadersFields, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyFieldsUpdate, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyHeadersFieldsIdProject, auth_role_middleware_1.authRoleMiddleware.authAdminUser, resourseCategory_controller_1.resourseCategoryController.update);
resourseCategoryRouter.delete(`${prefix}/:id`, resourseCategory_middleware_1.resourseCategoryMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdminUser, resourseCategory_controller_1.resourseCategoryController.updateStatus);
exports.default = resourseCategoryRouter;

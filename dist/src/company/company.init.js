"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const company_controller_1 = require("./company.controller");
const company_middleware_1 = require("./company.middleware");
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const companyRouter = express_config_1.default.Router();
const prefix = "/companies";
companyRouter.post(`${prefix}`, company_controller_1.companyController.create);
companyRouter.get(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdmin, company_controller_1.companyController.allCompanies);
companyRouter.get(`${prefix}/search`, auth_role_middleware_1.authRoleMiddleware.authAdmin, company_controller_1.companyController.findByName);
companyRouter.get(`${prefix}/file/:id`, company_middleware_1.companyMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdmin, company_controller_1.companyController.findImage);
companyRouter.get(`${prefix}/:id`, company_middleware_1.companyMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdmin, company_controller_1.companyController.findByIdCompany);
companyRouter.put(`${prefix}/:id`, company_controller_1.companyController.update);
companyRouter.delete(`${prefix}/:id`, company_middleware_1.companyMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdmin, company_controller_1.companyController.updateStatus);
exports.default = companyRouter;

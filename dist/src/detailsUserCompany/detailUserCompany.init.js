"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const detailUserCompany_middleware_1 = require("./detailUserCompany.middleware");
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const detailsUserCompany_controller_1 = require("./detailsUserCompany.controller");
const detailUserCompanyRouter = express_config_1.default.Router();
const prefix = "/users_company";
detailUserCompanyRouter.get(`${prefix}/unassigned`, detailUserCompany_middleware_1.detailUserCompanyMiddleware.verifyHeadersFieldsIdCompanyHeader, auth_role_middleware_1.authRoleMiddleware.authAdminUser, detailsUserCompany_controller_1.detailUserCompanyController.allUsersByCompanyUnassigned);
exports.default = detailUserCompanyRouter;

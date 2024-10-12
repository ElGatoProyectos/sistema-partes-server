"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const workforce_middleware_1 = require("./workforce.middleware");
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const workforce_controller_1 = require("./workforce.controller");
const workforceRouter = express_config_1.default.Router();
const prefix = "/mano-de-obra";
workforceRouter.post(`${prefix}/upload-excel`, workforce_middleware_1.workforceMiddleware.verifyHeadersFieldsIdProject, auth_role_middleware_1.authRoleMiddleware.authAdminUser, workforce_controller_1.workforceController.workforceReadExcel);
exports.default = workforceRouter;

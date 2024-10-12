"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const resources_controller_1 = require("./resources.controller");
// import { resourcesMiddleware } from "./resources.middleware";
const resourceRouter = express_config_1.default.Router();
const prefix = "/resource";
resourceRouter.post(`${prefix}/upload-excel`, 
// resourcesMiddleware.verifyHeadersFieldsIdProject,
auth_role_middleware_1.authRoleMiddleware.authAdminUser, resources_controller_1.resourceController.resourceReadExcel);
exports.default = resourceRouter;

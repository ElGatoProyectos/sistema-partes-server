"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const job_middleware_1 = require("./job.middleware");
const job_controller_1 = require("./job.controller");
const jobRouter = express_config_1.default.Router();
const prefix = "/job";
jobRouter.post(`${prefix}`, job_middleware_1.jobMiddleware.verifyFields, auth_role_middleware_1.authRoleMiddleware.authAdminAndCostControl, job_controller_1.jobController.create);
exports.default = jobRouter;

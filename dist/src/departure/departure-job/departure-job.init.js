"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const express_config_1 = __importDefault(require("@/config/express.config"));
const departure_job_controller_1 = require("./departure-job.controller");
const departureJobRouter = express_config_1.default.Router();
const prefix = "/departure-job";
departureJobRouter.post(`${prefix}/upload-excel`, auth_role_middleware_1.authRoleMiddleware.authAdminUser, departure_job_controller_1.departureJobController.departureJobReadExcel);
departureJobRouter.get(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdminUser, departure_job_controller_1.departureJobController.allDetailsDepartureJob);
exports.default = departureJobRouter;

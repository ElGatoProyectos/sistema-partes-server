"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const departure_middleware_1 = require("./departure.middleware");
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const departure_controller_1 = require("./departure.controller");
const departureRouter = express_config_1.default.Router();
const prefix = "/departure";
departureRouter.post(`${prefix}/upload-excel`, departure_middleware_1.departureMiddleware.verifyHeadersFieldsIdProject, auth_role_middleware_1.authRoleMiddleware.authAdminUser, departure_controller_1.departureController.departureReadExcel);
departureRouter.get(`${prefix}`, departure_middleware_1.departureMiddleware.verifyHeadersFieldsIdProject, auth_role_middleware_1.authRoleMiddleware.authAdminUser, departure_controller_1.departureController.allDepartures);
departureRouter.get(`${prefix}/:id`, departure_middleware_1.departureMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdminUser, departure_controller_1.departureController.findById);
exports.default = departureRouter;

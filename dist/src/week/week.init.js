"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const week_controller_1 = require("./week.controller");
const weekRouter = express_config_1.default.Router();
const prefix = "/week";
weekRouter.get(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdminUser, week_controller_1.weekController.findWeek);
exports.default = weekRouter;

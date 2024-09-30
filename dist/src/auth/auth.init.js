"use strict";
//aca rutas
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const login_middleware_1 = require("./middlewares/login.middleware");
const auth_controller_1 = require("./auth.controller");
const authRouter = express_config_1.default.Router();
const prefix = "/auth";
authRouter.post(`${prefix}/login`, login_middleware_1.loginMiddleware.validateBody, auth_controller_1.authController.login
//authRoleMiddleware.authAdmin
);
authRouter.post(`${prefix}/me`, auth_controller_1.authController.me);
exports.default = authRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const express_config_1 = __importDefault(require("@/config/express.config"));
const unifiedIndex_controller_1 = require("./unifiedIndex.controller");
const unifiedIndex_middleware_1 = require("./unifiedIndex.middleware");
const unifiedIndexRouter = express_config_1.default.Router();
const prefix = "/unified-index";
unifiedIndexRouter.post(`${prefix}`, unifiedIndex_middleware_1.unifiedIndexMiddleware.verifyFieldsRegistry, auth_role_middleware_1.authRoleMiddleware.authAdmin, unifiedIndex_controller_1.unifiedIndexController.create);
unifiedIndexRouter.post(`${prefix}/upload-excel/company/:id`, unifiedIndex_middleware_1.unifiedIndexMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unifiedIndex_controller_1.unifiedIndexController.unifiedIndexReadExcel);
unifiedIndexRouter.get(`${prefix}`, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unifiedIndex_controller_1.unifiedIndexController.allUnifiedIndex);
unifiedIndexRouter.get(`${prefix}/search`, auth_role_middleware_1.authRoleMiddleware.authAdmin, unifiedIndex_controller_1.unifiedIndexController.findByName);
unifiedIndexRouter.get(`${prefix}/:id`, unifiedIndex_middleware_1.unifiedIndexMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdmin, unifiedIndex_controller_1.unifiedIndexController.findByIdUnifiedIndex);
unifiedIndexRouter.put(`${prefix}/:id`, unifiedIndex_middleware_1.unifiedIndexMiddleware.verifyHeadersFields, unifiedIndex_middleware_1.unifiedIndexMiddleware.verifyFieldsUpdate, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unifiedIndex_controller_1.unifiedIndexController.update);
unifiedIndexRouter.delete(`${prefix}/:id`, unifiedIndex_middleware_1.unifiedIndexMiddleware.verifyHeadersFields, auth_role_middleware_1.authRoleMiddleware.authAdminAndProjectManager, unifiedIndex_controller_1.unifiedIndexController.updateStatus);
exports.default = unifiedIndexRouter;
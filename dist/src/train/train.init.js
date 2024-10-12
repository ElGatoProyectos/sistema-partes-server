"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_config_1 = __importDefault(require("@/config/express.config"));
const train_controller_1 = require("./train.controller");
const auth_role_middleware_1 = require("@/auth/middlewares/auth-role.middleware");
const train_middleware_1 = require("./train.middleware");
const trainRouter = express_config_1.default.Router();
const prefix = "/train";
trainRouter.get(`${prefix}`, train_middleware_1.trainMiddleware.verifyHeadersFieldsIdProject, auth_role_middleware_1.authRoleMiddleware.authAdminUser, train_controller_1.trainController.allTrains);
trainRouter.get(`${prefix}/:id`, train_middleware_1.trainMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdminUser, train_controller_1.trainController.findByIdTrain);
trainRouter.post(`${prefix}`, train_middleware_1.trainMiddleware.verifyHeadersFieldsIdProject, train_middleware_1.trainMiddleware.verifyFields, auth_role_middleware_1.authRoleMiddleware.authAdminUser, train_controller_1.trainController.create);
trainRouter.post(`${prefix}/upload-excel`, train_middleware_1.trainMiddleware.verifyHeadersFieldsIdProject, auth_role_middleware_1.authRoleMiddleware.authAdminUser, train_controller_1.trainController.trainReadExcel);
trainRouter.delete(`${prefix}/:id`, train_middleware_1.trainMiddleware.verifyHeadersFieldsId, auth_role_middleware_1.authRoleMiddleware.authAdminUser, train_controller_1.trainController.updateStatus);
trainRouter.put(`${prefix}/:id`, train_middleware_1.trainMiddleware.verifyHeadersFieldsId, train_middleware_1.trainMiddleware.verifyFieldsUpdate, auth_role_middleware_1.authRoleMiddleware.authAdminUser, train_controller_1.trainController.update);
exports.default = trainRouter;

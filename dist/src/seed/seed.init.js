"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed_controller_1 = require("./seed.controller");
const express_config_1 = __importDefault(require("@/config/express.config"));
const seedRouter = express_config_1.default.Router();
const prefix = "/seed";
seedRouter.post(`${prefix}`, seed_controller_1.seedController.create);
exports.default = seedRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
require("dotenv/config");
exports.envConfig = {
    port: process.env.PORT || 4000,
    jwt_token: process.env.JWT_TOKEN || "secret",
};

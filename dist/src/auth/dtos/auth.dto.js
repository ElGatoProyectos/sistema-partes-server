"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtDecodeDto = void 0;
const zod_1 = require("zod");
exports.jwtDecodeDto = zod_1.z.object({
    sub: zod_1.z.string(),
    iat: zod_1.z.number(),
    id: zod_1.z.number(),
    role: zod_1.z.string(),
});

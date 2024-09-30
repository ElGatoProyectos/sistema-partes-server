"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainDto = void 0;
const zod_1 = require("zod");
exports.trainDto = zod_1.z.object({
    nombre: zod_1.z.string(),
    nota: zod_1.z.string(),
});

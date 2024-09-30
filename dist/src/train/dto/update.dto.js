"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainUpdateDto = void 0;
const zod_1 = require("zod");
exports.trainUpdateDto = zod_1.z.object({
    nombre: zod_1.z.string(),
    nota: zod_1.z.string(),
    operario: zod_1.z.number().optional(),
    oficial: zod_1.z.number().optional(),
    peon: zod_1.z.number().optional(),
});

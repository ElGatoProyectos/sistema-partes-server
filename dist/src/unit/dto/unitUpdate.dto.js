"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitUpdateDto = void 0;
const zod_1 = require("zod");
exports.unitUpdateDto = zod_1.z.object({
    nombre: zod_1.z.string().optional(),
    simbolo: zod_1.z.string().optional(),
});

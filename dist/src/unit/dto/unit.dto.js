"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitDto = void 0;
const zod_1 = require("zod");
exports.unitDto = zod_1.z.object({
    nombre: zod_1.z.string(),
    simbolo: zod_1.z.string(),
    descripcion: zod_1.z.string(),
});

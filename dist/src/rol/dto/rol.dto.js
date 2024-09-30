"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolDto = void 0;
const zod_1 = require("zod");
exports.rolDto = zod_1.z.object({
    nombre_secundario: zod_1.z.string(),
    descripcion: zod_1.z.string(),
    rol: zod_1.z.string(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobDto = void 0;
const zod_1 = require("zod");
exports.jobDto = zod_1.z.object({
    up_id: zod_1.z.number(),
    tren_id: zod_1.z.number(),
    nombre: zod_1.z.string(),
    nota: zod_1.z.string().optional(),
    fecha_inicio: zod_1.z.string(),
    fecha_finalizacion: zod_1.z.string(),
    duracion: zod_1.z.number(),
    usuario_id: zod_1.z.number(),
});

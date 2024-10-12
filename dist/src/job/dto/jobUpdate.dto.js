"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobUpdateDto = void 0;
const zod_1 = require("zod");
exports.jobUpdateDto = zod_1.z.object({
    up_id: zod_1.z.number(),
    tren_id: zod_1.z.number(),
    nombre: zod_1.z.string().optional(),
    nota: zod_1.z.string().optional(),
    fecha_inicio: zod_1.z.string().optional(),
    fecha_finalizacion: zod_1.z.string().optional(),
    duracion: zod_1.z.number().optional(),
    usuario_id: zod_1.z.number(),
});

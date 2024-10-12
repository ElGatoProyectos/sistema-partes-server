"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proyectoDtoUpdate = void 0;
const zod_1 = require("zod");
exports.proyectoDtoUpdate = zod_1.z.object({
    nombre_completo: zod_1.z.string().optional(),
    descripcion: zod_1.z.string().optional(),
    direccion: zod_1.z.string().optional(),
    nombre_consorcio: zod_1.z.string().optional(),
    nombre_corto: zod_1.z.string().min(3).optional(),
    fecha_inicio: zod_1.z.string().optional(),
    fecha_fin: zod_1.z.string().optional(),
    plazo_proyecto: zod_1.z.string().optional(),
});

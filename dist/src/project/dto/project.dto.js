"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proyectoDto = void 0;
const zod_1 = require("zod");
exports.proyectoDto = zod_1.z.object({
    nombre_completo: zod_1.z.string(),
    descripcion: zod_1.z.string().optional(),
    direccion: zod_1.z.string(),
    nombre_consorcio: zod_1.z.string(),
    nombre_corto: zod_1.z.string().min(3),
    fecha_inicio: zod_1.z.string(),
    fecha_fin: zod_1.z.string(),
    plazo_proyecto: zod_1.z.string(),
    color_primario: zod_1.z.string().optional(),
    color_personalizado: zod_1.z.string().optional(),
    color_linea: zod_1.z.string().optional(),
    color_detalle: zod_1.z.string().optional(),
    color_menu: zod_1.z.string().optional(),
    color_submenu: zod_1.z.string().optional(),
});

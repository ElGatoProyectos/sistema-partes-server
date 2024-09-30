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
    estado: zod_1.z.enum(["CREADO", "REPROGRAMADO", "EJECUCION", "TERMINADO"]),
    fecha_inicio: zod_1.z.string().optional(),
    fecha_fin: zod_1.z.string().optional(),
    plazo_proyecto: zod_1.z.string().optional(),
    color_primario: zod_1.z.string(),
    color_personalizado: zod_1.z.string(),
    color_linea: zod_1.z.string(),
    color_detalle: zod_1.z.string(),
    color_menu: zod_1.z.string(),
    color_submenu: zod_1.z.string(),
});

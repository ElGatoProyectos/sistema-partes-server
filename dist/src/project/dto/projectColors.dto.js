"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proyectoColorsDto = void 0;
const zod_1 = require("zod");
exports.proyectoColorsDto = zod_1.z.object({
    color_primario: zod_1.z.string().optional(),
    color_personalizado: zod_1.z.string().optional(),
    color_linea: zod_1.z.string().optional(),
    color_detalle: zod_1.z.string().optional(),
    color_menu: zod_1.z.string().optional(),
    color_submenu: zod_1.z.string().optional(),
});

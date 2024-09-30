"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresaDto = void 0;
const zod_1 = require("zod");
exports.empresaDto = zod_1.z.object({
    nombre_empresa: zod_1.z.string(),
    descripcion_empresa: zod_1.z.string().optional(),
    ruc: zod_1.z.string().min(11),
    direccion_fiscal: zod_1.z.string(),
    direccion_oficina: zod_1.z.string(),
    nombre_corto: zod_1.z.string(),
    telefono: zod_1.z.string(),
    correo: zod_1.z.string(),
    contacto_responsable: zod_1.z.string(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAndCompanyUpdateDto = void 0;
const zod_1 = require("zod");
exports.userAndCompanyUpdateDto = zod_1.z.object({
    email: zod_1.z.string(),
    dni: zod_1.z.string().min(8),
    nombre_completo: zod_1.z.string(),
    telefono: zod_1.z.string(),
    contrasena: zod_1.z.string().optional(),
    limite_proyecto: zod_1.z.string(),
    limite_usuarios: zod_1.z.string(),
    eliminado: zod_1.z.enum(["y", "n"]),
    nombre_empresa: zod_1.z.string(),
    descripcion_empresa: zod_1.z.string(),
    ruc: zod_1.z.string(),
    telefono_empresa: zod_1.z.string(),
    nombre_corto_empresa: zod_1.z.string(),
    direccion_empresa_fiscal: zod_1.z.string(),
    direccion_empresa_oficina: zod_1.z.string(),
    email_empresa: zod_1.z.string(),
    contacto_responsable: zod_1.z.string(),
});

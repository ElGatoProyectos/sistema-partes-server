"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateDto = void 0;
const zod_1 = require("zod");
exports.userUpdateDto = zod_1.z.object({
    email: zod_1.z.string().optional(),
    dni: zod_1.z.string().min(8).optional(),
    nombre_completo: zod_1.z.string().optional(),
    telefono: zod_1.z.string().optional(),
    contrasena: zod_1.z.string().optional(),
    estado: zod_1.z.enum(["y", "n"]),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDto = void 0;
const zod_1 = require("zod");
exports.userDto = zod_1.z.object({
    email: zod_1.z.string(),
    dni: zod_1.z.string().min(8),
    nombre_completo: zod_1.z.string(),
    telefono: zod_1.z.string(),
    contrasena: zod_1.z.string().min(3),
    // limite_proyecto: z.number(),
    // limite_usuarios: z.number(),
    // rol_id: z.number(),  // COMENTE ESTO XQ AHORA VA A TENER UN ROL NO ASIGNADO POR DEFECTO ASI LUEGO LE ASIGNAN
});

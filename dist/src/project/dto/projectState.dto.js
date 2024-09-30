"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proyectoStateDto = void 0;
const zod_1 = require("zod");
exports.proyectoStateDto = zod_1.z.object({
    state: zod_1.z.enum(["CREADO", "REPROGRAMADO", "EJECUCION", "TERMINADO"]),
});

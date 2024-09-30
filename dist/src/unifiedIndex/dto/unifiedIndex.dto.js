"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unifiedIndexDto = void 0;
const zod_1 = require("zod");
exports.unifiedIndexDto = zod_1.z.object({
    nombre: zod_1.z.string(),
    simbolo: zod_1.z.string(),
    comentario: zod_1.z.string(),
});

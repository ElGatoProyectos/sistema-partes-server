"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateRolDto = void 0;
const zod_1 = require("zod");
exports.userUpdateRolDto = zod_1.z.object({
    usuario_id: zod_1.z.number(),
    rol_id: zod_1.z.number(),
    action: zod_1.z.string(),
});

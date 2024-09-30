"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateRolDto = void 0;
const zod_1 = require("zod");
exports.userUpdateRolDto = zod_1.z.object({
    idUser: zod_1.z.number(),
    idRol: zod_1.z.number(),
});

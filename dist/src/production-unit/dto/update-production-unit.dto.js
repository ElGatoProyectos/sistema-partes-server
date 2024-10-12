"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prouductionUnitUpdateDto = void 0;
const zod_1 = require("zod");
exports.prouductionUnitUpdateDto = zod_1.z.object({
    nombre: zod_1.z.string().optional(),
    nota: zod_1.z.string().optional(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prouductionUnitDto = void 0;
const zod_1 = require("zod");
exports.prouductionUnitDto = zod_1.z.object({
    nombre: zod_1.z.string(),
    nota: zod_1.z.string().optional(),
});

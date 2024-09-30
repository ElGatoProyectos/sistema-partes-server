"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuadrillaDto = void 0;
const zod_1 = require("zod");
exports.cuadrillaDto = zod_1.z.object({
    workers: zod_1.z.number(),
    official: zod_1.z.number(),
    pawns: zod_1.z.number(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourseCategoryDto = void 0;
const zod_1 = require("zod");
exports.resourseCategoryDto = zod_1.z.object({
    nombre: zod_1.z.string(),
});

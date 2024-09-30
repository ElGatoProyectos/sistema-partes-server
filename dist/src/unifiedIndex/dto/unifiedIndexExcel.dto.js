"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unifiedIndexExcelDto = void 0;
const zod_1 = require("zod");
exports.unifiedIndexExcelDto = zod_1.z.object({
    idCompany: zod_1.z.string(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionsDto = void 0;
const zod_1 = require("zod");
const actionSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
exports.permissionsDto = zod_1.z.object({
    sections: zod_1.z.number(),
    actions: zod_1.z.array(actionSchema),
});

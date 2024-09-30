"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolController = void 0;
const rol_service_1 = require("./rol.service");
class RolController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const result = yield rol_service_1.rolService.createRol(data);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
    }
    findByIdRol(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idRol = Number(request.params.id);
            const result = yield rol_service_1.rolService.findById(idRol);
            response.status(result.statusCode).json(result);
        });
    }
    allRoles(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield rol_service_1.rolService.findAll();
            response.status(result.statusCode).json(result);
        });
    }
}
exports.rolController = new RolController();

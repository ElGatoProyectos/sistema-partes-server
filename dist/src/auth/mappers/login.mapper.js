"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseMapper = void 0;
class LoginResponseMapper {
    constructor(user, nameRole) {
        (this.id = user.id),
            (this.nombre_completo = user.nombre_completo),
            (this.rol = nameRole);
    }
}
exports.LoginResponseMapper = LoginResponseMapper;
exports.default = LoginResponseMapper;

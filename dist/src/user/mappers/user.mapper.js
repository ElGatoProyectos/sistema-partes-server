"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseMapper = void 0;
class UserResponseMapper {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.dni = user.dni;
        this.nombre_completo = user.nombre_completo;
        this.rol_id = user.rol_id;
        this.telefono = user.telefono;
        this.eliminado = user.eliminado;
        this.limite_proyecto = user.limite_proyecto;
        this.fecha_creacion = user.fecha_creacion;
        this.rol_id = user.rol_id;
        this.limite_usuarios = user.limite_usuarios;
    }
}
exports.UserResponseMapper = UserResponseMapper;

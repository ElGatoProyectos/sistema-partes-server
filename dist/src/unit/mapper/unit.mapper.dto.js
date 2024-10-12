"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUnitMapper = void 0;
class ResponseUnitMapper {
    constructor(unit) {
        this.id = unit.id;
        this.codigo = unit.codigo;
        this.nombre = unit.nombre;
        this.simbolo = unit.simbolo ? unit.simbolo : "";
        this.empresa_id = unit.empresa_id;
        this.fecha_creacion = unit.fecha_creacion;
        this.proyecto_id = unit.proyecto_id;
    }
}
exports.ResponseUnitMapper = ResponseUnitMapper;

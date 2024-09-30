"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainResponseMapper = void 0;
class TrainResponseMapper {
    constructor(train) {
        this.id = train.id;
        this.codigo = train.codigo;
        this.nombre = train.nombre;
        this.nota = train.nota ? train.nota : "";
        this.operario = train.operario;
        this.oficial = train.oficial;
        this.peon = train.peon;
        this.fecha_creacion = train.fecha_creacion;
        this.proyecto_id = train.proyecto_id;
    }
}
exports.TrainResponseMapper = TrainResponseMapper;

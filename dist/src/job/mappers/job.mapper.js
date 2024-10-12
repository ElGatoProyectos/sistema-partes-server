"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobResponseMapper = void 0;
class JobResponseMapper {
    constructor(job) {
        this.id = job.id;
        this.codigo = job.codigo;
        this.nombre = job.nombre;
        this.duracion = job.duracion;
        this.fecha_inicio = job.fecha_inicio;
        this.fecha_finalizacion = job.fecha_finalizacion;
        this.nota = job.nota;
        this.costo_partida = job.costo_partida;
        this.costo_mano_obra = job.costo_mano_obra;
        this.costo_material = job.costo_material;
        this.costo_equipo = job.costo_equipo;
        this.costo_varios = job.costo_varios;
        this.tren_id = job.tren_id;
        this.estado_trabajo = job.estado_trabajo;
        this.up_id = job.up_id;
        this.proyecto_id = job.proyecto_id;
        this.usuario_id = job.usuario_id;
    }
}
exports.JobResponseMapper = JobResponseMapper;

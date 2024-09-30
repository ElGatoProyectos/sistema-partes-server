"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectResponseMapper = void 0;
class ProjectResponseMapper {
    constructor(project) {
        this.id = project.id;
        this.nombre_completo = project.nombre_completo;
        this.descripcion = project.descripcion ? project.descripcion : "";
        this.direccion = project.direccion;
        this.nombre_consorcio = project.nombre_consorcio;
        this.nombre_corto = project.nombre_corto;
        this.estado = project.estado;
        this.costo_proyecto = project.costo_proyecto;
        this.fecha_inicio = project.fecha_inicio;
        this.fecha_creacion = project.fecha_creacion;
        this.fecha_fin = project.fecha_fin;
        this.plazo_proyecto = project.plazo_proyecto;
        this.codigo_proyecto = project.codigo_proyecto;
        this.color_primario = project.color_primario ? project.color_primario : "";
        this.color_personalizado = project.color_personalizado
            ? project.color_personalizado
            : "";
        this.color_linea = project.color_linea ? project.color_linea : "";
        this.color_detalle = project.color_detalle ? project.color_detalle : "";
        this.color_menu = project.color_menu ? project.color_menu : "";
        this.color_submenu = project.color_submenu ? project.color_submenu : "";
        this.empresa_id = project.empresa_id;
    }
}
exports.ProjectResponseMapper = ProjectResponseMapper;

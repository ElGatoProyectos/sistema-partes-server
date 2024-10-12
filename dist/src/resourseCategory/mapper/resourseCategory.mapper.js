"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourseCategoryMapper = void 0;
class ResourseCategoryMapper {
    constructor(resourseCategory) {
        this.id = resourseCategory.id;
        this.codigo = resourseCategory.codigo;
        this.nombre = resourseCategory.nombre;
        this.fecha_creacion = resourseCategory.fecha_creacion;
        this.proyecto_id = resourseCategory.proyecto_id;
    }
}
exports.ResourseCategoryMapper = ResourseCategoryMapper;

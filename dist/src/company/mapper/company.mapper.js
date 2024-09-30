"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyResponseMapper = void 0;
class CompanyResponseMapper {
    constructor(company) {
        this.id = company.id;
        this.nombre_empresa = company.nombre_empresa;
        this.descripcion_empresa = company.descripcion_empresa
            ? company.descripcion_empresa
            : "";
        this.ruc = company.ruc ? company.ruc : "";
        this.nombre_corto = company.nombre_corto ? company.nombre_corto : "";
        this.telefono = company.telefono ? company.telefono : "";
        this.direccion_fiscal = company.direccion_fiscal;
        this.direccion_oficina = company.direccion_oficina;
        this.usuario_id = company.usuario_id;
        this.fecha_creacion = company.fecha_creacion;
        this.correo = company.correo;
        this.contacto_responsable = company.contacto_responsable;
    }
}
exports.CompanyResponseMapper = CompanyResponseMapper;

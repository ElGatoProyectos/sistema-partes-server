import { E_Estado_BD, Empresa } from "@prisma/client";

export class CompanyResponseMapper implements Omit<Empresa, "eliminado"> {
  id: number;
  nombre_empresa: string;
  descripcion_empresa: string;
  ruc: string;
  nombre_corto: string;
  telefono: string;
  usuario_id: number;
  fecha_creacion: Date;
  razon_social: string;
  direccion_fiscal: string;
  direccion_oficina: string;
  correo: string;
  contacto_responsable: string;

  constructor(company: Empresa) {
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
    this.razon_social = company.razon_social ? company.razon_social : "";
    this.correo = company.correo;
    this.contacto_responsable = company.contacto_responsable;
  }
}

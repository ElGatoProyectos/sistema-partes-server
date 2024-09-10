import { E_Estado_BD, Empresa } from "@prisma/client";

export class CompanyResponseMapper implements Omit<Empresa, "eliminado"> {
  id: number;
  nombre_empresa: string;
  descripcion_empresa: string;
  ruc: string;
  nombre_corto: string;
  telefono: string;
  direccion: string;
  usuario_id: number;
  fecha_creacion: Date;

  constructor(user: Empresa) {
    this.id = user.id;
    this.nombre_empresa = user.nombre_empresa;
    this.descripcion_empresa = user.descripcion_empresa
      ? user.descripcion_empresa
      : "";
    this.ruc = user.ruc ? user.ruc : "";
    this.nombre_corto = user.nombre_corto ? user.nombre_corto : "";
    this.telefono = user.telefono ? user.telefono : "";
    this.direccion = user.direccion ? user.direccion : "";
    this.usuario_id = user.usuario_id;
    this.fecha_creacion = user.fecha_creacion;
  }
}

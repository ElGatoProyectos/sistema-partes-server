import { ManoObra } from "@prisma/client";

export interface I_CreateWorkforceBD extends Omit<ManoObra, "id"> {}

export interface I_CreateWorkforceBody extends Omit<ManoObra, "id"> {}

export interface I_UpdateWorkforceBody extends Omit<ManoObra, "id"> {}

export interface I_UpdateWorkforceBodyValidation
  extends Omit<
    ManoObra,
    | "id"
    | "codigo"
    | "eliminado"
    | "fecha_creacion"
    | "fecha_inicio"
    | "fecha_cese"
    | "fecha_nacimiento"
    | "apellido_materno"
    | "apellido_paterno"
    | "turno"
    | "sede_local"
    | "usuario_marcacion"
    | "domicilio"
    | "lugar_nacimiento"
    | "genero"
    | "tipo_documento"
    | "contrasena"
    | "profesion"
    | "estado_civil"
    | "n_libreta_militar"
    | "n_pasaporte"
    | "email_corporativo"
    | "brevete"
    | "grado_instruccion"
    | "ruc"
    | "tipo_cese"
    | "carnet_extranjeria"
    | "condicion"
    | "pais_origen"
    | "hora_ingreso"
    | "hora_salida"
    | "tolerancia_ingreso"
    | "tiempo_refrigerio"
  > {}

export interface I_Workforce extends Omit<ManoObra, "eliminado"> {}

export interface I_WorkforceExcel {
  DNI: string;
  "APELLIDO Y NOMBRE COMPLETO": string;
  TIPO: string;
  ORIGEN: string;
  CATEGORIA: string;
  ESPECIALIDAD: string;
  UNIDAD: string;
  INGRESO: number;
  CESE: number;
  ESTADO: string;
  BANCO: string;
  CUENTA: string;
  "FECHA DE NACIMIENTO": number;
  ESCOLARIDAD: string;
  CELULAR: string;
  CORREO: string;
  OBSERVACION: string;
}

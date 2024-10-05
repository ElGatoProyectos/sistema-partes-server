import { Usuario } from "@prisma/client";

export interface I_Usuario extends Usuario {
  Rol?: {
    id: number;
    nombre_secundario: string;
    descripcion: string;
    rol: string;
    eliminado: string;
  };
}

export interface I_DetalleUsuarioEmpresa {
  id: number;
  usuario_id: number;
  empresa_id: number;
  Usuario: I_Usuario;
}

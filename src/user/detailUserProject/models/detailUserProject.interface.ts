import { I_Usuario } from "@/user/models/user.interface";

export interface I_CreateDetailUserProject {
  usuario_id: number;
  projecto_id: number;
}
export interface I_DetailUserProject {
  id: number;
  usuario_id: number;
  projecto_id: number;
  Usuario: I_Usuario;
}

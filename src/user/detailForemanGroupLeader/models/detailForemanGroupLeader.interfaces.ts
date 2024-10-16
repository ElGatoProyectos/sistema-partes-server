import { I_Usuario } from "@/user/models/user.interface";

export interface I_DetailForemanGroupLeader {
  id: number;
  usuario_capataz_id: number;
  usuario_jefe_grupo_id: number;
  CapatazJefe: I_Usuario;
  JefeGrupo: I_Usuario;
}

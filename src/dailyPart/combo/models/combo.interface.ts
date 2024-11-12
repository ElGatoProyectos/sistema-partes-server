import { Combo } from "@prisma/client";

export interface I_CreateComboBD extends Omit<Combo, "id" | "fecha_creacion"> {}

export interface I_CreateComboBody {
  nombre: string;
  workforces_id: number[];
}

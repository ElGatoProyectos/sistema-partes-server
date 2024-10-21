import { Banco } from "@prisma/client";

export interface I_CreateBankWorkforceBD
  extends Omit<Banco, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_CreateBankWorkforceBody
  extends Omit<Banco, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_BankWorkforce extends Omit<Banco, "eliminado"> {}

export interface I_UpdateBankBD
  extends Omit<Banco, "id" | "fecha_creacion" | "eliminado"> {}

export interface I_BankBody {
  nombre: string;
}

export interface I_Bank extends Omit<Banco, "eliminado"> {}

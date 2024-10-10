import { Banco } from "@prisma/client";

export interface I_CreateBankWorkforceBD extends Omit<Banco, "id"> {}

export interface I_CreateBankWorkforceBody extends Omit<Banco, "id"> {}

export interface I_BankWorkforce extends Omit<Banco, "eliminado"> {}

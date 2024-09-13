import { IndiceUnificado } from "@prisma/client";

export interface I_CreateUnifiedIndexBD extends Omit<IndiceUnificado, "id"> {}

export interface I_CreateUnifiedIndexBody extends Omit<IndiceUnificado, "id"> {}

export interface I_UpdateUnifiedIndexBody extends Omit<IndiceUnificado, "id"> {}

export interface I_UnifiedIndex extends Omit<IndiceUnificado, "eliminado"> {}

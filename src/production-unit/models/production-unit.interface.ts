import { UnidadProduccion } from "@prisma/client";

export interface I_CreateProductionUnitBD
  extends Omit<UnidadProduccion, "id"> {}

export interface I_CreateProductionUnitBody
  extends Omit<UnidadProduccion, "id"> {}

export interface I_UpdateProductionUnitBody
  extends Omit<UnidadProduccion, "id"> {}

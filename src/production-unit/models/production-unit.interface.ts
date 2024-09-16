import { UnidadProduccion } from "@prisma/client";

export interface I_CreateProductionUnitBD
  extends Omit<UnidadProduccion, "id"> {}

export interface I_CreateProductionUnitBody
  extends Omit<UnidadProduccion, "id"> {}

export interface I_UpdateProductionUnitBody
  extends Omit<UnidadProduccion, "id"> {}

export interface I_ProductionUnit extends Omit<UnidadProduccion, "eliminado"> {}

export interface I_ProductionUnitExcel {
  Nombre: string;
  Nota: string;
}
export interface I_ImportExcelRequest {
  idProject: string;
}

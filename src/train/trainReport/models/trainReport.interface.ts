import { ResporteAvanceTren } from "@prisma/client";

export interface I_CreateReportTrainBD extends Omit<ResporteAvanceTren, "id"> {}

export interface I_UpdateReportTrainBD extends Omit<ResporteAvanceTren, "id"> {}
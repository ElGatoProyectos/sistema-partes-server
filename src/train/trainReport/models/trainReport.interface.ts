import { ReporteAvanceTren } from "@prisma/client";

export interface I_CreateReportTrainBD extends Omit<ReporteAvanceTren, "id"> {}

export interface I_UpdateReportTrainBD extends Omit<ReporteAvanceTren, "id"> {}
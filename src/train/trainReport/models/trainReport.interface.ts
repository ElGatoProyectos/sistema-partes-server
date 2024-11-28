import { ReporteAvanceTren } from "@prisma/client";

export interface I_CreateReportTrainBD extends Omit<ReporteAvanceTren, "id"> {}

export interface I_UpdateReportTrainBD extends Omit<ReporteAvanceTren, "id"> {}

export interface I_ReportTrain{
    id_tren: string, 
    tren: string,
    costo_total: number,
    ejecutado_anterior: number,
    ejecutado_actual: number,
    saldo: number, 
    lunes: number,
    martes: number,
    miercoles: number,
    jueves: number,
    viernes: number,
    sabado: number,
    domingo: number,
    parcial:number,
}

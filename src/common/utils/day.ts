import { ReporteAvanceTren } from "@prisma/client";

// Define el tipo de los campos
export type DiasSemana = 'domingo' | 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';

/**
 * Obtiene el nombre del campo según el día actual de la semana.
 * @returns El nombre del día de la semana correspondiente al día actual.
 */
export const obtenerCampoPorDia = (date:Date): DiasSemana => {
  const diaActual = date.getUTCDay(); // Obtiene el número del día actual (0 = Domingo, 6 = Sábado)

  const camposPorDia: Record<number, DiasSemana> = {
    0: 'domingo',
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sabado',
  };

  return camposPorDia[diaActual];
};

export function calculateTotalNew(day: string, reportTrain: ReporteAvanceTren, totalDay: number): number {
  let current_executed = 0;

  switch (day) {
    case "domingo":
      current_executed = 
        reportTrain.lunes + 
        reportTrain.martes + 
        reportTrain.miercoles + 
        reportTrain.jueves + 
        reportTrain.viernes + 
        reportTrain.sabado + 
        totalDay;
      break;

    case "lunes":
      current_executed = 
        totalDay + 
        reportTrain.martes + 
        reportTrain.miercoles + 
        reportTrain.jueves + 
        reportTrain.viernes + 
        reportTrain.sabado + 
        reportTrain.domingo;
      break;

    case "martes":
      current_executed = 
        reportTrain.lunes + 
        totalDay + 
        reportTrain.miercoles + 
        reportTrain.jueves + 
        reportTrain.viernes + 
        reportTrain.sabado + 
        reportTrain.domingo;
      break;

    case "miercoles":
      current_executed = 
        reportTrain.lunes + 
        reportTrain.martes + 
        totalDay + 
        reportTrain.jueves + 
        reportTrain.viernes + 
        reportTrain.sabado + 
        reportTrain.domingo;
      break;

    case "jueves":
      current_executed = 
        reportTrain.lunes + 
        reportTrain.martes + 
        reportTrain.miercoles + 
        totalDay + 
        reportTrain.viernes + 
        reportTrain.sabado + 
        reportTrain.domingo;
      break;

    case "viernes":
      current_executed = 
        reportTrain.lunes + 
        reportTrain.martes + 
        reportTrain.miercoles + 
        reportTrain.jueves + 
        totalDay + 
        reportTrain.sabado + 
        reportTrain.domingo;
      break;

    case "sabado":
      current_executed = 
        reportTrain.lunes + 
        reportTrain.martes + 
        reportTrain.miercoles + 
        reportTrain.jueves + 
        reportTrain.viernes + 
        totalDay + 
        reportTrain.domingo;
      break;

    default:
      break
  }

  return current_executed;
}
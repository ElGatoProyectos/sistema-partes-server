// Define el tipo de los campos
export type DiasSemana = 'domingo' | 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';

/**
 * Obtiene el nombre del campo según el día actual de la semana.
 * @returns El nombre del día de la semana correspondiente al día actual.
 */
export const obtenerCampoPorDia = (): DiasSemana => {
  const diaActual = new Date().getUTCDay(); // Obtiene el número del día actual (0 = Domingo, 6 = Sábado)

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
export function converToDate(date: string): Date {
  const dateWithTime = new Date(date);
  // dateWithTime.setHours(0, 0, 0, 0);
  // const dateWithoutTim = dateWithTime.toISOString().split("T")[0];
  // const dateResponse = new Date(dateWithoutTim);
  return dateWithTime;
}

function obtenerDiaEnEspanol(fecha: Date): string {
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const diaNumero = fecha.getDay(); // Obtiene un número de 0 a 6
  return diasSemana[diaNumero];
}

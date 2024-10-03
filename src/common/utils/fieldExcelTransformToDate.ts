export function excelDateToDate(serial: number) {
  const excelEpoch = new Date(1900, 0, 1);
  const days = serial;

  return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
}

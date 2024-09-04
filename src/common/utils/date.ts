export function converToDate(date: string): Date {
  const dateWithTime = new Date(date);
  // dateWithTime.setHours(0, 0, 0, 0);
  // const dateWithoutTim = dateWithTime.toISOString().split("T")[0];
  // const dateResponse = new Date(dateWithoutTim);
  return dateWithTime;
}

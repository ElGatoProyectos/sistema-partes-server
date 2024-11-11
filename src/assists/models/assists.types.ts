export type T_FindAllAssists = {
  queryParams: {
    page: number;
    limit: number;
    search: string;
    state: string;
    week: string;
    date: string;
  };
};
export type T_FindAllWeekAssists = {
  queryParams: {
    page: number;
    limit: number;
    search: string;
    week: string;
  };
};
export type T_FindAllAssistsForDailyPart = {
  queryParams: {
    page: number;
    limit: number;
    search: string;
    category: string;
    combo: string;
  };
};

export type EstadoAsistenciaCounts = {
  ASIGNADO: number;
  NO_ASIGNADO: number;
  FALTA: number;
  DOBLEMENTE_ASIGNADO: number;
};

export type T_FindAllDailyPartForJob = {
  queryParams: {
    page: number;
    limit: number;
    date: string;
  };
};
export type T_FindAllDailyPart = {
  queryParams: {
    page: number;
    limit: number;
    stage: string;
    train: string;
    job: string;
    start: string;
    end: string;
  };
};

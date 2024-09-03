export type T_ProyectoResponse<T = any> = {
  message: string;
  payload?: T;
  statusCode: number;
};

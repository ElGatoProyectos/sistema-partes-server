import { DetalleParteDiarioFoto } from "@prisma/client";

export interface I_CreateDetailPhotosBD {
  comentario_uno?: string;
  comentario_dos?: string;
  comentario_tres?: string;
  comentario_cuatro?: string;
  parte_diario_id: number;
}

export interface I_UpdateDetailPhotosBD {
  comentario_uno?: string;
  comentario_dos?: string;
  comentario_tres?: string;
  comentario_cuatro?: string;
  parte_diario_id: number;
}

export interface I_CreateDetailPhotosBody {
  comentary_one?: string;
  comentary_two?: string;
  comentary_three?: string;
  comentary_four?: string;
}
export interface ResponseDetailPhotosBody {
  comentary_one?: string | null;
  comentary_two?: string | null;
  comentary_three?: string | null;
  comentary_four?: string | null;
}

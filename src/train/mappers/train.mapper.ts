import { Tren } from "@prisma/client";

export class TrainResponseMapper implements Omit<Tren, "eliminado"> {
  id: number;
  codigo: string;
  nombre: string;
  cuadrilla: string;
  nota: string;
  operario: number;
  oficial: number;
  peon: number;
  fecha_creacion: Date;
  proyecto_id: number;

  constructor(train: Tren) {
    this.id = train.id;
    this.codigo = train.codigo;
    this.nombre = train.nombre;
    this.cuadrilla = train.cuadrilla ? train.cuadrilla : "";
    this.nota = train.nota ? train.nota : "";
    this.operario = train.operario;
    this.oficial = train.oficial;
    this.peon = train.peon;
    this.fecha_creacion = train.fecha_creacion;
    this.proyecto_id = train.proyecto_id;
  }
}

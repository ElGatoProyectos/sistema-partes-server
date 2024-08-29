import { I_CreateProyectoBD } from "./models/proyecto.interface";

export abstract class ProyectoRepository {
  createProject(data: I_CreateProyectoBD): void {}

  //findByImage()
}

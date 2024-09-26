import { I_CreateAccionBD } from "./models/action.repository";

export abstract class ActionRepository {
  createAction(data: I_CreateAccionBD): void {}

  findById(section_id: number): void {}

  findByName(name: string): void {}
}

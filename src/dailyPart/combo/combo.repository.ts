import { I_CreateComboBD } from "./models/combo.interface";

export abstract class ComboRepository {
  createCombo(data: I_CreateComboBD): void {}
  createDetailCombo(idsWorkforces: number[], combo_id: number): void {}
  findById(combo_id: number): void {}
  findAllWithOutPagination(project_id: number): void {}
  findAllWithOutPaginationOfDetail(combo_id: number): void {}
}

import {
  I_CreateUnifiedIndexBD,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";
import { T_FindAllUnifiedIndex } from "./models/unifiedIndex.types";

export abstract class UnifiedIndexRepository {
  findAll(
    skip: number,
    data: T_FindAllUnifiedIndex,
    project_id: number
  ): void {}

  findByCode(code: string): void {}

  codeMoreHigh(project_id: number): void {}

  findById(idUnifiedIndex: number): void {}

  existsName(name: string, project_id: number): void {}

  existSymbol(symbol: string, project_id: number): void {}

  createUnifiedIndex(data: I_CreateUnifiedIndexBD): void {}

  updateUnifiedIndex(
    data: I_UpdateUnifiedIndexBody,
    idUnifiedIndex: number
  ): void {}

  updateStatusUnifiedIndex(idUnifiedIndex: number): void {}

  createUnifiedIndexMasive(data: I_CreateUnifiedIndexBD[]): void {}
}

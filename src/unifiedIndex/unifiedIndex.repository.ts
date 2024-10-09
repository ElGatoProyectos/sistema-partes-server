import {
  I_CreateUnifiedIndexBD,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";
import { T_FindAllUnifiedIndex } from "./models/unifiedIndex.types";

export abstract class UnifiedIndexRepository {
  findAll(skip: number, data: T_FindAllUnifiedIndex): void {}

  findByCode(code: string): void {}

  codeMoreHigh(): void {}

  findById(idUnifiedIndex: number): void {}

  existsName(name: string): void {}

  existSymbol(symbol: string): void {}

  createUnifiedIndex(data: I_CreateUnifiedIndexBD): void {}

  updateUnifiedIndex(
    data: I_UpdateUnifiedIndexBody,
    idUnifiedIndex: number
  ): void {}

  updateStatusUnifiedIndex(idUnifiedIndex: number): void {}
}

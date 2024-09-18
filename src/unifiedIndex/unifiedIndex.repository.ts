import {
  I_CreateUnifiedIndexBD,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";

export abstract class UnifiedIndexRepository {
  findAll(skip: number, limit: number): void {}

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

  searchNameUnifiedIndex(name: string, skip: number, limit: number): void {}
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaUnifiedIndexRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaUnifiedIndexRepository {
    codeMoreHigh() {
        return __awaiter(this, void 0, void 0, function* () {
            const lastUnifiedIndex = yield prisma_config_1.default.indiceUnificado.findFirst({
                where: {
                    eliminado: client_1.E_Estado_BD.n,
                },
                orderBy: { codigo: "desc" },
            });
            return lastUnifiedIndex;
        });
    }
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const unifiedIndex = yield prisma_config_1.default.indiceUnificado.findFirst({
                where: {
                    codigo: code,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return unifiedIndex;
        });
    }
    existSymbol(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const unifiedIndex = yield prisma_config_1.default.indiceUnificado.findFirst({
                where: {
                    simbolo: symbol,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return unifiedIndex;
        });
    }
    searchNameUnifiedIndex(name, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [unifiedIndex, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.indiceUnificado.findMany({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                    },
                    skip,
                    take: limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.indiceUnificado.count({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                    },
                }),
            ]);
            return { unifiedIndex, total };
        });
    }
    findAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [unifiedIndex, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.indiceUnificado.findMany({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                    },
                    skip,
                    take: limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.indiceUnificado.count({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                    },
                }),
            ]);
            return { unifiedIndex, total };
        });
    }
    findById(idUnifiedIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const unifiedIndex = yield prisma_config_1.default.indiceUnificado.findFirst({
                where: {
                    id: idUnifiedIndex,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return unifiedIndex;
        });
    }
    existsName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const unifiedIndex = yield prisma_config_1.default.indiceUnificado.findFirst({
                where: {
                    nombre: name,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return unifiedIndex;
        });
    }
    createUnifiedIndex(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const unifiedIndex = yield prisma_config_1.default.indiceUnificado.create({
                data,
            });
            return unifiedIndex;
        });
    }
    updateUnifiedIndex(data, idUnifiedIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const unifiedIndex = yield prisma_config_1.default.indiceUnificado.update({
                where: { id: idUnifiedIndex },
                data: data,
            });
            return unifiedIndex;
        });
    }
    updateStatusUnifiedIndex(idUnifiedIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const unifiedIndex = yield prisma_config_1.default.indiceUnificado.findFirst({
                where: {
                    id: idUnifiedIndex,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            const newStateUnifiedIndex = (unifiedIndex === null || unifiedIndex === void 0 ? void 0 : unifiedIndex.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const unifiedIndexUpdate = yield prisma_config_1.default.indiceUnificado.update({
                where: { id: idUnifiedIndex },
                data: {
                    eliminado: newStateUnifiedIndex,
                },
            });
            return unifiedIndexUpdate;
        });
    }
}
exports.prismaUnifiedIndexRepository = new PrismaUnifiedIndexRepository();
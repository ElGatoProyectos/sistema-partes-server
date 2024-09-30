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
exports.prismaUnitRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaUnitRepository {
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_config_1.default.unidad.findFirst({
                where: {
                    codigo: code,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return unit;
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastUnit = yield prisma_config_1.default.unidad.findFirst({
                where: {
                    // eliminado: E_Estado_BD.n,
                    proyecto_id: project_id,
                },
                orderBy: { codigo: "desc" },
            });
            return lastUnit;
        });
    }
    existsSymbol(symbol, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_config_1.default.unidad.findFirst({
                where: {
                    simbolo: symbol,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return unit;
        });
    }
    // async existsName(name: string): Promise<Unidad | null> {
    //   const resourseCategory = await prisma.unidad.findFirst({
    //     where: {
    //       nombre: name,
    //       eliminado: E_Estado_BD.n,
    //     },
    //   });
    //   return resourseCategory;
    // }
    searchNameUnit(name, skip, limit, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [units, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.unidad.findMany({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                        proyecto_id: project_id,
                    },
                    skip,
                    take: limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.unidad.count({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                        proyecto_id: project_id,
                    },
                }),
            ]);
            return { units, total };
        });
    }
    findAll(skip, limit, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [units, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.unidad.findMany({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                        proyecto_id: project_id,
                    },
                    skip,
                    take: limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.unidad.count({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                        proyecto_id: project_id,
                    },
                }),
            ]);
            return { units, total };
        });
    }
    findById(idUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_config_1.default.unidad.findFirst({
                where: {
                    id: idUnit,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return unit;
        });
    }
    existsName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourseCategory = yield prisma_config_1.default.unidad.findFirst({
                where: {
                    nombre: name,
                    eliminado: client_1.E_Estado_BD.n,
                    proyecto_id: project_id,
                },
            });
            return resourseCategory;
        });
    }
    createUnit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_config_1.default.unidad.create({
                data,
            });
            return unit;
        });
    }
    updateUnit(data, idUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            const unidad = yield prisma_config_1.default.unidad.update({
                where: { id: idUnit },
                data: data,
            });
            return unidad;
        });
    }
    updateStatusUnit(idUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_config_1.default.unidad.findFirst({
                where: {
                    id: idUnit,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            const newStateUnit = (unit === null || unit === void 0 ? void 0 : unit.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const unitUpdate = yield prisma_config_1.default.unidad.update({
                where: { id: idUnit },
                data: {
                    eliminado: newStateUnit,
                },
            });
            return unitUpdate;
        });
    }
}
exports.prismaUnitRepository = new PrismaUnitRepository();

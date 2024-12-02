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
exports.prismaProductionUnitRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrimsaProductionUnitRepository {
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const productionUnit = yield prisma_config_1.default.unidadProduccion.findFirst({
                where: {
                    codigo: code,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return productionUnit;
        });
    }
    existsName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const productionUnit = yield prisma_config_1.default.unidadProduccion.findFirst({
                where: {
                    nombre: name,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return productionUnit;
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastProductionUnit = yield prisma_config_1.default.unidadProduccion.findFirst({
                where: {
                    proyecto_id: project_id,
                    // eliminado: E_Estado_BD.n,
                },
                orderBy: { codigo: "desc" },
            });
            return lastProductionUnit;
        });
    }
    createProductionUnit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const productionUnit = yield prisma_config_1.default.unidadProduccion.create({
                data,
            });
            return productionUnit;
        });
    }
    updateProductionUnit(data, idProductionUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            const productionUnit = yield prisma_config_1.default.unidadProduccion.update({
                where: { id: idProductionUnit },
                data: data,
            });
            return productionUnit;
        });
    }
    searchNameProductionUnit(name, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [productionUnits, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.unidadProduccion.findMany({
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
                prisma_config_1.default.unidadProduccion.count({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                    },
                }),
            ]);
            return { productionUnits, total };
        });
    }
    findAllPagination(skip, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            if (data.queryParams.search) {
                if (isNaN(data.queryParams.search)) {
                    filters.nombre = {
                        contains: data.queryParams.search,
                    };
                }
                else {
                    filters.codigo = {
                        contains: data.queryParams.search,
                    };
                }
            }
            const [productionUnits, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.unidadProduccion.findMany({
                    where: Object.assign(Object.assign({}, filters), { proyecto_id: project_id, eliminado: client_1.E_Estado_BD.n }),
                    skip,
                    take: data.queryParams.limit,
                    omit: {
                        eliminado: true,
                    },
                    orderBy: {
                        codigo: "asc",
                    },
                }),
                prisma_config_1.default.unidadProduccion.count({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n }),
                }),
            ]);
            return { productionUnits, total };
        });
    }
    findById(idProductionUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            const productionUnit = yield prisma_config_1.default.unidadProduccion.findFirst({
                where: {
                    id: idProductionUnit,
                },
                omit: {
                    eliminado: true,
                },
            });
            return productionUnit;
        });
    }
    updateStatusProductionUnit(idProductionUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            const productionUnit = yield prisma_config_1.default.unidadProduccion.findFirst({
                where: {
                    id: idProductionUnit,
                },
            });
            const newStateProductionUnit = (productionUnit === null || productionUnit === void 0 ? void 0 : productionUnit.eliminado) == client_1.E_Estado_BD.y
                ? client_1.E_Estado_BD.n
                : client_1.E_Estado_BD.y;
            const productionUnitUpdate = yield prisma_config_1.default.unidadProduccion.update({
                where: { id: idProductionUnit },
                data: {
                    eliminado: newStateProductionUnit,
                },
            });
            return productionUnitUpdate;
        });
    }
}
exports.prismaProductionUnitRepository = new PrimsaProductionUnitRepository();

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
exports.prismaTrainRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaTrainRepository {
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const train = yield prisma_config_1.default.tren.findFirst({
                where: {
                    codigo: code,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return train;
        });
    }
    existsName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const train = yield prisma_config_1.default.tren.findFirst({
                where: {
                    nombre: name,
                    proyecto_id: project_id,
                },
            });
            return train;
        });
    }
    updateCuadrillaByIdTrain(idTrain, workers, official, pawns) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateTrain = yield prisma_config_1.default.tren.update({
                where: {
                    id: idTrain,
                },
                data: {
                    operario: workers,
                    oficial: official,
                    peon: pawns,
                },
            });
            return updateTrain;
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastTrain = yield prisma_config_1.default.tren.findFirst({
                where: {
                    // eliminado: E_Estado_BD.n,
                    proyecto_id: project_id,
                },
                orderBy: { codigo: "desc" },
            });
            return lastTrain;
        });
    }
    createTrain(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const train = yield prisma_config_1.default.tren.create({
                data,
            });
            return train;
        });
    }
    updateTrain(data, idTrain) {
        return __awaiter(this, void 0, void 0, function* () {
            const train = yield prisma_config_1.default.tren.update({
                where: { id: idTrain },
                data: data,
            });
            return train;
        });
    }
    searchNameTrain(name, skip, limit, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [trains, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.tren.findMany({
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
                prisma_config_1.default.tren.count({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                        proyecto_id: project_id,
                    },
                }),
            ]);
            return { trains, total };
        });
    }
    findAll(skip, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            if (data.queryParams.name) {
                filters.nombre = {
                    contains: data.queryParams.name,
                };
            }
            const [trains, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.tren.findMany({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
                    skip,
                    take: data.queryParams.limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.tren.count({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
                }),
            ]);
            return { trains, total };
        });
    }
    findById(idTrain) {
        return __awaiter(this, void 0, void 0, function* () {
            const train = yield prisma_config_1.default.tren.findFirst({
                where: {
                    id: idTrain,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return train;
        });
    }
    updateStatusTrain(idTrain) {
        return __awaiter(this, void 0, void 0, function* () {
            const train = yield prisma_config_1.default.tren.findFirst({
                where: {
                    id: idTrain,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            const newStateTrain = (train === null || train === void 0 ? void 0 : train.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const trainUpdate = yield prisma_config_1.default.tren.update({
                where: { id: idTrain },
                data: {
                    eliminado: newStateTrain,
                },
            });
            return trainUpdate;
        });
    }
}
exports.prismaTrainRepository = new PrismaTrainRepository();

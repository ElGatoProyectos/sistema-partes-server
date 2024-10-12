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
exports.prismaDepartureRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaDepartureRepository {
    createDeparture(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const departure = yield prisma_config_1.default.partida.create({
                data,
            });
            return departure;
        });
    }
    updateDeparture(data, departure_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const departure = yield prisma_config_1.default.partida.update({
                where: { id: departure_id },
                data: data,
            });
            return departure;
        });
    }
    findAll(skip, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            if (data.queryParams.search) {
                if (isNaN(data.queryParams.search)) {
                    filters.partida = {
                        contains: data.queryParams.search,
                    };
                }
                else {
                    filters.id_interno = {
                        contains: data.queryParams.search,
                    };
                }
            }
            const [departures, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.partida.findMany({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
                    include: {
                        Unidad: true,
                    },
                    skip,
                    take: data.queryParams.limit,
                    omit: {
                        eliminado: true,
                    },
                    orderBy: {
                        id_interno: "asc",
                    },
                }),
                prisma_config_1.default.partida.count({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
                }),
            ]);
            return { departures, total };
        });
    }
    findById(departure_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const departure = yield prisma_config_1.default.partida.findFirst({
                where: {
                    id: departure_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return departure;
        });
    }
    existsName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const departure = yield prisma_config_1.default.partida.findFirst({
                where: {
                    partida: name,
                    eliminado: client_1.E_Estado_BD.n,
                    proyecto_id: project_id,
                },
            });
            return departure;
        });
    }
    updateStatusDeparture(idUser) {
        throw new Error("Method not implemented.");
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_config_1.default.partida.findFirst({
                where: {
                    id_interno: code,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return unit;
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastUnit = yield prisma_config_1.default.partida.findFirst({
                where: {
                    proyecto_id: project_id,
                },
                orderBy: { id_interno: "desc" },
            });
            return lastUnit;
        });
    }
}
exports.prismaDepartureRepository = new PrismaDepartureRepository();

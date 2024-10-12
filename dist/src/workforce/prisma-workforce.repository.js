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
exports.prismaWorkforceRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaWorkforceRepository {
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workforce = yield prisma_config_1.default.manoObra.findFirst({
                where: {
                    codigo: code,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return workforce;
        });
    }
    findByDNI(dni, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workforce = yield prisma_config_1.default.manoObra.findFirst({
                where: {
                    documento_identidad: dni,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return workforce;
        });
    }
    existsName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workforce = yield prisma_config_1.default.manoObra.findFirst({
                where: {
                    nombre_completo: name,
                    proyecto_id: project_id,
                },
            });
            return workforce;
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastWorkforce = yield prisma_config_1.default.manoObra.findFirst({
                where: {
                    eliminado: client_1.E_Estado_BD.n,
                    proyecto_id: project_id,
                },
                orderBy: { codigo: "desc" },
            });
            return lastWorkforce;
        });
    }
    createWorkforce(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const workforce = yield prisma_config_1.default.manoObra.create({
                data,
            });
            return workforce;
        });
    }
    updateWorkforce(data, workforce_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workforce = yield prisma_config_1.default.manoObra.update({
                where: { id: workforce_id },
                data: data,
            });
            return workforce;
        });
    }
    findAll(skip, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            if (data.queryParams.search) {
                if (isNaN(data.queryParams.search)) {
                    filters.nombre_completo = {
                        contains: data.queryParams.search,
                    };
                }
                else {
                    filters.codigo = {
                        contains: data.queryParams.search,
                    };
                }
            }
            const [workforces, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.manoObra.findMany({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
                    skip,
                    take: data.queryParams.limit,
                    omit: {
                        eliminado: true,
                    },
                    orderBy: {
                        codigo: "asc",
                    },
                }),
                prisma_config_1.default.manoObra.count({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
                }),
            ]);
            return { workforces, total };
        });
    }
    findById(workforce_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workforce = yield prisma_config_1.default.manoObra.findFirst({
                where: {
                    id: workforce_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return workforce;
        });
    }
    updateStatusWorkforce(workforce_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workforce = yield prisma_config_1.default.manoObra.findFirst({
                where: {
                    id: workforce_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            const newStateTrain = (workforce === null || workforce === void 0 ? void 0 : workforce.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const trainUpdate = yield prisma_config_1.default.manoObra.update({
                where: { id: workforce_id },
                data: {
                    eliminado: newStateTrain,
                },
            });
            return trainUpdate;
        });
    }
}
exports.prismaWorkforceRepository = new PrismaWorkforceRepository();

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
exports.prismaJobRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaJobRepository {
    createJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.create({
                data,
            });
            return job;
        });
    }
    updateJob(data, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: data,
            });
            return job;
        });
    }
    updateStatusJob(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.findFirst({
                where: {
                    id: job_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            const newStateTrain = (job === null || job === void 0 ? void 0 : job.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const trainUpdate = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: {
                    eliminado: newStateTrain,
                },
            });
            return trainUpdate;
        });
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.findFirst({
                where: {
                    codigo: code,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return job;
        });
    }
    existsName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.findFirst({
                where: {
                    nombre: name,
                    proyecto_id: project_id,
                },
            });
            return job;
        });
    }
    findAll(skip, limit, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [jobs, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.trabajo.findMany({
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
                prisma_config_1.default.trabajo.count({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                        proyecto_id: project_id,
                    },
                }),
            ]);
            return { jobs, total };
        });
    }
    findById(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const train = yield prisma_config_1.default.trabajo.findFirst({
                where: {
                    id: job_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return train;
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastJob = yield prisma_config_1.default.trabajo.findFirst({
                where: {
                    // eliminado: E_Estado_BD.n,
                    proyecto_id: project_id,
                },
                orderBy: { codigo: "desc" },
            });
            return lastJob;
        });
    }
    searchNameJob(name, skip, limit, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [jobs, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.trabajo.findMany({
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
                prisma_config_1.default.trabajo.count({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                        proyecto_id: project_id,
                    },
                }),
            ]);
            return { jobs, total };
        });
    }
}
exports.prismaJobRepository = new PrismaJobRepository();

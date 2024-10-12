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
const date_1 = require("@/common/utils/date");
class PrismaJobRepository {
    updateJobFromExcel(data, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: data,
            });
            return job;
        });
    }
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
    updateJobCost(cost, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: {
                    costo_partida: cost,
                },
            });
            return job;
        });
    }
    updateJobCostOfLabor(labor, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: {
                    costo_mano_obra: labor,
                },
            });
            return job;
        });
    }
    updateJobMaterialCost(material, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: {
                    costo_material: material,
                },
            });
            return job;
        });
    }
    updateJobEquipment(equipment, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: {
                    costo_equipo: equipment,
                },
            });
            return job;
        });
    }
    updateJobSeveral(several, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield prisma_config_1.default.trabajo.update({
                where: { id: job_id },
                data: {
                    costo_varios: several,
                },
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
    findAll(skip, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            let filtersTrain = {};
            let fecha_inicio;
            let fecha_finalizacion;
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
            if (data.queryParams.fecha_inicio) {
                fecha_inicio = (0, date_1.converToDate)(data.queryParams.fecha_inicio);
                filters.fecha_inicio = {
                    gte: fecha_inicio,
                };
            }
            if (data.queryParams.fecha_finalizacion) {
                fecha_finalizacion = (0, date_1.converToDate)(data.queryParams.fecha_finalizacion);
                filters.fecha_finalizacion = {
                    gte: fecha_finalizacion,
                };
            }
            if (data.queryParams.nameTrain) {
                filtersTrain.nombre = {
                    contains: data.queryParams.nameTrain,
                };
            }
            const [jobs, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.trabajo.findMany({
                    where: Object.assign(Object.assign({}, filters), { Tren: Object.assign({}, filtersTrain), eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
                    skip,
                    take: data.queryParams.limit,
                    omit: {
                        eliminado: true,
                    },
                    orderBy: {
                        codigo: "asc",
                    },
                }),
                prisma_config_1.default.trabajo.count({
                    where: Object.assign(Object.assign({}, filters), { Tren: Object.assign({}, filtersTrain), eliminado: client_1.E_Estado_BD.n, proyecto_id: project_id }),
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
}
exports.prismaJobRepository = new PrismaJobRepository();

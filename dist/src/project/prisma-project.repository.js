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
exports.prismaProyectoRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaProjectRepository {
    constructor() {
        this.findById = (idProject) => __awaiter(this, void 0, void 0, function* () {
            const project = yield prisma_config_1.default.proyecto.findFirst({
                where: {
                    id: idProject,
                },
                omit: {
                    eliminado: true,
                },
            });
            return project;
        });
    }
    totalProjectsByCompany(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersCompany = yield prisma_config_1.default.proyecto.count({
                where: {
                    empresa_id: company_id,
                },
            });
            return usersCompany;
        });
    }
    codeMoreHigh(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastProject = yield prisma_config_1.default.proyecto.findFirst({
                where: {
                    // eliminado: E_Estado_BD.n,
                    empresa_id: company_id,
                },
                orderBy: { codigo_proyecto: "desc" },
            });
            return lastProject;
        });
    }
    updateStateProject(idProject, stateProject) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield prisma_config_1.default.proyecto.update({
                where: { id: idProject },
                data: {
                    estado: stateProject,
                },
            });
            return project;
        });
    }
    searchNameProject(data, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            if (data.queryParams.state) {
                filters.estado = data.queryParams.state.toUpperCase();
            }
            if (data.queryParams.name) {
                filters.nombre_completo = {
                    contains: data.queryParams.name,
                };
            }
            const [projects, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.proyecto.findMany({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n }),
                    skip: skip,
                    take: data.queryParams.limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.proyecto.count({
                    where: Object.assign(Object.assign({}, filters), { eliminado: client_1.E_Estado_BD.n }),
                }),
            ]);
            return { projects, total };
        });
    }
    allProjectsuser(company_id, data, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            // if (data.queryParams.state) {
            //   filters.estado = data.queryParams.state.toUpperCase();
            // }
            if (data.queryParams.state &&
                data.queryParams.state.toUpperCase() !== "TODOS") {
                filters.estado = data.queryParams.state.toUpperCase();
            }
            if (data.queryParams.name) {
                filters.nombre_completo = {
                    contains: data.queryParams.name,
                };
            }
            const [projects, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.proyecto.findMany({
                    where: Object.assign(Object.assign({}, filters), { empresa_id: company_id, eliminado: client_1.E_Estado_BD.n }),
                    skip,
                    take: data.queryParams.limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.proyecto.count({
                    where: Object.assign(Object.assign({}, filters), { empresa_id: company_id, eliminado: client_1.E_Estado_BD.n }),
                }),
            ]);
            return { projects, total };
        });
    }
    updateStatusProject(idProject) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield prisma_config_1.default.proyecto.findFirst({
                where: {
                    id: idProject,
                },
            });
            const newStateProject = (project === null || project === void 0 ? void 0 : project.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const projectUpdate = yield prisma_config_1.default.proyecto.update({
                where: { id: idProject },
                data: {
                    eliminado: newStateProject,
                },
            });
            return projectUpdate;
        });
    }
    updateProject(dataProject, idProject) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = Object.assign(Object.assign({}, dataProject), { costo_proyecto: Number(dataProject.costo_proyecto) });
            const project = yield prisma_config_1.default.proyecto.update({
                where: { id: idProject },
                data: updatedData,
            });
            return project;
        });
    }
    createProject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield prisma_config_1.default.proyecto.create({
                data: data,
            });
            return project;
        });
    }
    updateColorsProject(project_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield prisma_config_1.default.proyecto.update({
                where: {
                    id: project_id,
                },
                data: data,
            });
            return project;
        });
    }
}
exports.prismaProyectoRepository = new PrismaProjectRepository();

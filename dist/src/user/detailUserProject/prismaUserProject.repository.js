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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaDetailUserProjectRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaDetailUserProjectRepository {
    getAllUsersOfProjectUnassigned(skip, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            let users = [];
            let total;
            if (data.queryParams.name) {
                filters.nombre_completo = {
                    contains: data.queryParams.name,
                };
            }
            [users, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.detalleUsuarioProyecto.findMany({
                    where: {
                        projecto_id: project_id,
                        Usuario: Object.assign({}, filters),
                    },
                    include: {
                        Usuario: {
                            include: {
                                Rol: true,
                            },
                        },
                    },
                    skip,
                    take: data.queryParams.limit,
                }),
                prisma_config_1.default.detalleUsuarioProyecto.count({
                    where: {
                        projecto_id: project_id,
                        Usuario: Object.assign({}, filters),
                    },
                }),
            ]);
            const userAll = users.map((item) => {
                const { Usuario } = item, company = __rest(item, ["Usuario"]);
                const { Rol } = Usuario, user = __rest(Usuario, ["Rol"]);
                return {
                    usuario: user,
                    rol: Rol,
                };
            });
            return { userAll, total };
        });
    }
    findByUser(user_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = yield prisma_config_1.default.detalleUsuarioProyecto.findFirst({
                where: {
                    usuario_id: user_id,
                    projecto_id: project_id,
                },
            });
            return detail;
        });
    }
    deleteUserByDetail(idDetailUserProject) {
        return __awaiter(this, void 0, void 0, function* () {
            const detailUserProjectDeleted = yield prisma_config_1.default.detalleUsuarioProyecto.delete({
                where: {
                    id: idDetailUserProject,
                },
            });
            return detailUserProjectDeleted;
        });
    }
    getAllUsersOfProject(skip, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            let users = [];
            let total;
            if (data.queryParams.name) {
                filters.nombre_completo = {
                    contains: data.queryParams.name,
                };
            }
            [users, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.detalleUsuarioProyecto.findMany({
                    where: {
                        projecto_id: project_id,
                        Usuario: Object.assign({}, filters),
                    },
                    include: {
                        Usuario: {
                            include: {
                                Rol: true,
                            },
                        },
                    },
                    skip,
                    take: data.queryParams.limit,
                }),
                prisma_config_1.default.detalleUsuarioProyecto.count({
                    where: {
                        projecto_id: project_id,
                        Usuario: Object.assign({}, filters),
                    },
                }),
            ]);
            const userAll = users.map((item) => {
                const { Usuario } = item, company = __rest(item, ["Usuario"]);
                const { Rol } = Usuario, user = __rest(Usuario, ["Rol"]);
                return {
                    usuario: user,
                    rol: Rol,
                };
            });
            return { userAll, total };
        });
    }
    createUserProject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const detailUserProject = yield prisma_config_1.default.detalleUsuarioProyecto.create({
                data: data,
            });
            return detailUserProject;
        });
    }
}
exports.prismaDetailUserProjectRepository = new PrismaDetailUserProjectRepository();

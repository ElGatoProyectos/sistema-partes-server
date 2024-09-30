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
exports.prismaUserRepository = void 0;
const rol_validation_1 = require("@/rol/rol.validation");
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const client_1 = require("@prisma/client");
const company_validation_1 = require("@/company/company.validation");
class PrismaUserRepository {
    getUsersForCompany(skip, limit, name, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            let users = [];
            let total;
            if (name) {
                filters.nombre_completo = {
                    contains: name,
                };
            }
            [users, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.detalleUsuarioEmpresa.findMany({
                    where: {
                        empresa_id: company_id,
                        Usuario: Object.assign({}, filters),
                    },
                    include: {
                        Usuario: {
                            include: {
                                Rol: true,
                            },
                        },
                        Empresa: true,
                    },
                    skip,
                    take: limit,
                }),
                prisma_config_1.default.detalleUsuarioEmpresa.count({
                    where: {
                        empresa_id: company_id,
                    },
                }),
            ]);
            const userAll = users.map((item) => {
                const { Usuario } = item, company = __rest(item, ["Usuario"]);
                const { Rol } = Usuario, user = __rest(Usuario, ["Rol"]);
                return {
                    empresa: company,
                    usuario: user,
                    rol: Rol,
                };
            });
            return { userAll, total };
        });
    }
    assignUserPermissions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDetailUserProject = yield prisma_config_1.default.detalleUsuarioProyecto.create({
                data: {
                    usuario_id: data.user_id,
                    projecto_id: data.project_id,
                },
            });
            let permisos = [];
            for (let i = 0; i < data.actions.length; i++) {
                const permiso = yield prisma_config_1.default.permisos.create({
                    data: {
                        seccion_id: +data.section.id,
                        accion_id: data.actions[i].id,
                        rol_id: data.rol_id,
                    },
                });
                permisos.push(permiso);
            }
            return {
                detalleUsuarioProyecto: resultDetailUserProject,
                permisos,
            };
        });
    }
    updaterRolUser(idUser, idRol) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.usuario.update({
                where: {
                    id: idUser,
                },
                data: {
                    rol_id: idRol,
                },
            });
            return user;
        });
    }
    existsEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.usuario.findFirst({
                where: {
                    email,
                },
            });
            return user;
        });
    }
    searchNameUser(name, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.usuario.findMany({
                    where: {
                        nombre_completo: {
                            contains: name,
                        },
                    },
                    skip,
                    take: limit,
                }),
                prisma_config_1.default.usuario.count({
                    where: {
                        nombre_completo: {
                            contains: name,
                        },
                    },
                }),
            ]);
            return { users, total };
        });
    }
    findByDni(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.usuario.findFirst({
                where: {
                    dni,
                },
            });
            return user;
        });
    }
    updateStatusUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.usuario.findFirst({
                where: {
                    id: idUser,
                },
            });
            const newStateUser = (user === null || user === void 0 ? void 0 : user.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const userUpdate = yield prisma_config_1.default.usuario.update({
                where: { id: idUser },
                data: {
                    eliminado: newStateUser,
                },
            });
            return userUpdate;
        });
    }
    updateUser(data, idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.usuario.update({
                where: { id: idUser },
                data,
            });
            return user;
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.usuario.create({
                data,
            });
            return user;
        });
    }
    findAll(skip, limit, name, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let filters = {};
            let users = [];
            let total;
            let userAll = [];
            if (name) {
                filters.nombre_completo = {
                    contains: name,
                };
            }
            const rolResponse = yield rol_validation_1.rolValidation.findById(user.rol_id);
            const rolFind = rolResponse.payload;
            if (rolFind.rol === "ADMIN") {
                [users, total] = yield prisma_config_1.default.$transaction([
                    prisma_config_1.default.empresa.findMany({
                        where: {
                            Usuario: Object.assign(Object.assign({}, filters), { Rol: {
                                    rol: {
                                        not: "ADMIN",
                                    },
                                } }),
                        },
                        //     where: {
                        //       ...filters,
                        //       Rol: {
                        //         rol: {
                        //           not: "ADMIN",
                        //         },
                        //       },
                        //     },
                        include: {
                            Usuario: {
                                include: {
                                    Rol: true,
                                },
                                omit: {
                                    contrasena: true,
                                },
                            }, // Esto incluirá la relación completa de usuarios
                        },
                        skip,
                        take: limit,
                    }),
                    prisma_config_1.default.empresa.count({
                        where: {
                            Usuario: Object.assign(Object.assign({}, filters), { Rol: {
                                    rol: {
                                        not: "ADMIN",
                                    },
                                } }),
                        },
                    }),
                ]);
                userAll = users.map((item) => {
                    const { Usuario } = item, company = __rest(item, ["Usuario"]);
                    const { Rol } = Usuario, user = __rest(Usuario, ["Rol"]);
                    return {
                        empresa: company,
                        usuario: user,
                        rol: Rol,
                    };
                });
            }
            if (rolFind.rol === "USER") {
                const companyResponse = yield company_validation_1.companyValidation.findByIdUser(user.id);
                const company = companyResponse.payload;
                [users, total] = yield prisma_config_1.default.$transaction([
                    prisma_config_1.default.detalleUsuarioEmpresa.findMany({
                        where: {
                            empresa_id: company.id,
                            Usuario: Object.assign({}, filters),
                        },
                        include: {
                            Usuario: {
                                include: {
                                    Rol: true,
                                },
                            },
                            Empresa: true,
                        },
                        skip,
                        take: limit,
                    }),
                    prisma_config_1.default.detalleUsuarioEmpresa.count({
                        where: {
                            empresa_id: company.id,
                        },
                    }),
                ]);
                userAll = users.map((item) => {
                    const { Usuario } = item, company = __rest(item, ["Usuario"]);
                    const { Rol } = Usuario, user = __rest(Usuario, ["Rol"]);
                    return {
                        empresa: company,
                        usuario: user,
                        rol: Rol,
                    };
                });
            }
            return { userAll, total };
        });
    }
    findById(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.usuario.findFirst({
                where: {
                    id: idUser,
                },
                include: {
                    Rol: true,
                },
                omit: {
                    contrasena: true,
                    eliminado: true,
                },
            });
            return user;
        });
    }
}
exports.prismaUserRepository = new PrismaUserRepository();

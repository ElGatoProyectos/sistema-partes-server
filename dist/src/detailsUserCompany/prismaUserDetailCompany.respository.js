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
exports.prismaDetailUserCompanyRepository = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
class PrismaDetailUserCompanyRepository {
    getAllUsersOfProjectUnassigned(skip, data, company_id) {
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
                prisma_config_1.default.detalleUsuarioEmpresa.findMany({
                    where: {
                        empresa_id: company_id,
                        Usuario: Object.assign(Object.assign({}, filters), { Rol: {
                                rol: "NO_ASIGNADO",
                            } }),
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
                prisma_config_1.default.detalleUsuarioEmpresa.count({
                    where: {
                        empresa_id: company_id,
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
    findByIdUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = yield prisma_config_1.default.detalleUsuarioEmpresa.findFirst({
                where: {
                    usuario_id: user_id,
                },
            });
            return detail;
        });
    }
    countUsersForCompany(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersCompany = yield prisma_config_1.default.detalleUsuarioEmpresa.count({
                where: {
                    empresa_id: company_id,
                },
            });
            return usersCompany;
        });
    }
    findByIdCompany(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = yield prisma_config_1.default.detalleUsuarioEmpresa.findFirst({
                where: {
                    empresa_id: company_id,
                },
            });
            return detail;
        });
    }
    createCompany(idUser, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const detailUserCompany = yield prisma_config_1.default.detalleUsuarioEmpresa.create({
                data: {
                    usuario_id: idUser,
                    empresa_id: idCompany,
                },
            });
            return detailUserCompany;
        });
    }
}
exports.prismaDetailUserCompanyRepository = new PrismaDetailUserCompanyRepository();

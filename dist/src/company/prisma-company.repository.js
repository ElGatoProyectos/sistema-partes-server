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
exports.prismaCompanyRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
class PrismaCompanyRepository {
    findByIdUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    usuario_id: idUser,
                },
            });
            return company;
        });
    }
    existsEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    correo: email,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return company;
        });
    }
    existsNameShort(nameShort) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    nombre_corto: nameShort,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return company;
        });
    }
    existsRuc(ruc) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    ruc: ruc,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return company;
        });
    }
    findCompanyByUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyByUser = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    usuario_id: idUser,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return companyByUser;
        });
    }
    existsName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    nombre_empresa: name,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return company;
        });
    }
    findAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [companies, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.empresa.findMany({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                    },
                    skip,
                    take: limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.empresa.count({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                    },
                }),
            ]);
            return { companies, total };
        });
    }
    findById(idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    id: idCompany,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return company;
        });
    }
    createCompany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.create({
                data,
            });
            return company;
        });
    }
    updateCompany(data, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.update({
                where: { id: idCompany },
                data: data,
            });
            return company;
        });
    }
    updateStatusCompany(idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma_config_1.default.empresa.findFirst({
                where: {
                    id: idCompany,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            const newStateCompany = (company === null || company === void 0 ? void 0 : company.eliminado) == client_1.E_Estado_BD.y ? client_1.E_Estado_BD.n : client_1.E_Estado_BD.y;
            const companyUpdate = yield prisma_config_1.default.empresa.update({
                where: { id: idCompany },
                data: {
                    eliminado: newStateCompany,
                },
            });
            return companyUpdate;
        });
    }
    searchNameCompany(name, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [companies, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.empresa.findMany({
                    where: {
                        nombre_empresa: {
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
                prisma_config_1.default.empresa.count({
                    where: {
                        nombre_empresa: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                    },
                }),
            ]);
            return { companies, total };
        });
    }
}
exports.prismaCompanyRepository = new PrismaCompanyRepository();

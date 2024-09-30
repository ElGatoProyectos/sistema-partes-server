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
exports.prismaResourseCategoryRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaResourseCategoryRepository {
    searchNameResourseCategory(name, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [resoursesCategories, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.categoriaRecurso.findMany({
                    where: {
                        nombre: {
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
                prisma_config_1.default.unidadProduccion.count({
                    where: {
                        nombre: {
                            contains: name,
                        },
                        eliminado: client_1.E_Estado_BD.n,
                    },
                }),
            ]);
            return { resoursesCategories, total };
        });
    }
    findAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [categoriesResources, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.categoriaRecurso.findMany({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                    },
                    skip,
                    take: limit,
                    omit: {
                        eliminado: true,
                    },
                }),
                prisma_config_1.default.categoriaRecurso.count({
                    where: {
                        eliminado: client_1.E_Estado_BD.n,
                    },
                }),
            ]);
            return { categoriesResources, total };
        });
    }
    findById(idResourseCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourseCategory = yield prisma_config_1.default.categoriaRecurso.findFirst({
                where: {
                    id: idResourseCategory,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return resourseCategory;
        });
    }
    existsName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourseCategory = yield prisma_config_1.default.categoriaRecurso.findFirst({
                where: {
                    nombre: name,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return resourseCategory;
        });
    }
    createResourseCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourseCategory = yield prisma_config_1.default.categoriaRecurso.create({
                data,
            });
            return resourseCategory;
        });
    }
    updateResourseCategory(data, idResourseCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourseCategory = yield prisma_config_1.default.categoriaRecurso.update({
                where: { id: idResourseCategory },
                data: data,
            });
            return resourseCategory;
        });
    }
    updateStatusResourseCategory(idResourseCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourseCategory = yield prisma_config_1.default.categoriaRecurso.findFirst({
                where: {
                    id: idResourseCategory,
                },
            });
            const newStateResourseCategory = (resourseCategory === null || resourseCategory === void 0 ? void 0 : resourseCategory.eliminado) == client_1.E_Estado_BD.y
                ? client_1.E_Estado_BD.n
                : client_1.E_Estado_BD.y;
            const companyUpdate = yield prisma_config_1.default.categoriaRecurso.update({
                where: { id: idResourseCategory },
                data: {
                    eliminado: newStateResourseCategory,
                },
            });
            return companyUpdate;
        });
    }
}
exports.prismaResourseCategoryRepository = new PrismaResourseCategoryRepository();

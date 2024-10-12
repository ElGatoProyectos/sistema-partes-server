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
exports.prismaTypeWorkforceRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaTypeWorkforceRepository {
    createTypeWorkforceMasive(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeWorkforce = yield prisma_config_1.default.tipoObrero.createMany({
                data,
            });
            return typeWorkforce;
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeWorkforce = yield prisma_config_1.default.tipoObrero.findFirst({
                where: {
                    nombre: {
                        contains: name,
                    },
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return typeWorkforce;
        });
    }
    createTypeWorkforce(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeWorkforce = yield prisma_config_1.default.tipoObrero.create({
                data,
            });
            return typeWorkforce;
        });
    }
    findAll(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const typesWorkforce = yield prisma_config_1.default.origenObrero.findMany({
                where: {
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return typesWorkforce;
        });
    }
    findById(type_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeWorkforce = yield prisma_config_1.default.origenObrero.findFirst({
                where: {
                    id: type_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return typeWorkforce;
        });
    }
}
exports.prismaTypeWorkforceRepository = new PrismaTypeWorkforceRepository();

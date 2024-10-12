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
exports.prismaOriginWorkforceRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaOriginWorkforceRepository {
    createOriginWorkforceMasive(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const originWorkforce = yield prisma_config_1.default.origenObrero.createMany({
                data,
            });
            return originWorkforce;
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const originWorkforce = yield prisma_config_1.default.origenObrero.findFirst({
                where: {
                    nombre: {
                        contains: name,
                    },
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return originWorkforce;
        });
    }
    createOriginWorkforce(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const originWorkforce = yield prisma_config_1.default.origenObrero.create({
                data,
            });
            return originWorkforce;
        });
    }
    findAll(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const originsWorkforce = yield prisma_config_1.default.origenObrero.findMany({
                where: {
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return originsWorkforce;
        });
    }
    findById(origin_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const originWorkforce = yield prisma_config_1.default.origenObrero.findFirst({
                where: {
                    id: origin_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return originWorkforce;
        });
    }
}
exports.prismaOriginWorkforceRepository = new PrismaOriginWorkforceRepository();

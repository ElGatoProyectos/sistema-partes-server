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
exports.prismaResourcesRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaResourcesRepository {
    updateResource(data, resource_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield prisma_config_1.default.recurso.update({
                where: { id: resource_id },
                data: data,
            });
            return resource;
        });
    }
    findById(resource_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield prisma_config_1.default.recurso.findFirst({
                where: {
                    id: resource_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
                omit: {
                    eliminado: true,
                },
            });
            return resource;
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastResource = yield prisma_config_1.default.recurso.findFirst({
                where: {
                    // eliminado: E_Estado_BD.n,
                    proyecto_id: project_id,
                },
                orderBy: { codigo: "desc" },
            });
            return lastResource;
        });
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield prisma_config_1.default.recurso.findFirst({
                where: {
                    codigo: code,
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return resource;
        });
    }
    findAll(project_id) {
        throw new Error("Method not implemented.");
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield prisma_config_1.default.recurso.findFirst({
                where: {
                    nombre: {
                        contains: name,
                    },
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return resource;
        });
    }
    createResource(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield prisma_config_1.default.recurso.create({
                data,
            });
            return resource;
        });
    }
}
exports.prismaResourcesRepository = new PrismaResourcesRepository();

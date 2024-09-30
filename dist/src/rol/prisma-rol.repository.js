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
exports.prismaRolRepository = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaRolRepository {
    existsName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const rolResponse = yield prisma_config_1.default.rol.findFirst({
                where: {
                    rol: name,
                },
            });
            return rolResponse;
        });
    }
    createRol(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_config_1.default.rol.create({
                data,
            });
            return user;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield prisma_config_1.default.rol.findMany({
                where: {
                    rol: {
                        notIn: ["ADMIN", "USER"], // Excluye tanto "ADMIN" como "USER"
                    },
                },
            });
            return roles;
        });
    }
    findById(idRol) {
        return __awaiter(this, void 0, void 0, function* () {
            const rol = yield prisma_config_1.default.rol.findFirst({
                where: {
                    id: idRol,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return rol;
        });
    }
}
exports.prismaRolRepository = new PrismaRolRepository();

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
exports.prismaBankWorkforceRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const client_1 = require("@prisma/client");
class PrismaBankWorkforceRepository {
    createBankWorkforceMasive(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = yield prisma_config_1.default.banco.createMany({
                data,
            });
            return bank;
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = yield prisma_config_1.default.banco.findFirst({
                where: {
                    nombre: {
                        contains: name,
                    },
                    proyecto_id: project_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return bank;
        });
    }
    existsName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankResponse = yield prisma_config_1.default.banco.findFirst({
                where: {
                    nombre: name,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return bankResponse;
        });
    }
    createBankWorkforce(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = yield prisma_config_1.default.banco.create({
                data,
            });
            return bank;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const banks = yield prisma_config_1.default.banco.findMany({
                where: {
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return banks;
        });
    }
    findById(bank_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bank = yield prisma_config_1.default.banco.findFirst({
                where: {
                    id: bank_id,
                    eliminado: client_1.E_Estado_BD.n,
                },
            });
            return bank;
        });
    }
}
exports.prismaBankWorkforceRepository = new PrismaBankWorkforceRepository();

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
exports.prismaDetailUserCompanyRepository = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
class PrismaDetailUserCompanyRepository {
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

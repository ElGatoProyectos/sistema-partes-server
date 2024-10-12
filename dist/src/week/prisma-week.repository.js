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
exports.prismaWeekRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaWeekRepository {
    findForDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const week = yield prisma_config_1.default.semana.findFirst({
                where: {
                    fecha_inicio: {
                        lte: date, // Menor o igual a la fecha de búsqueda
                    },
                    fecha_fin: {
                        gte: date, // Mayor o igual a la fecha de búsqueda
                    },
                },
            });
            return week;
        });
    }
    findLastWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            const week = yield prisma_config_1.default.semana.findFirst({
                orderBy: {
                    id: "desc", // Ordena por ID de forma descendente
                },
            });
            return week;
        });
    }
    findByDate(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const week = yield prisma_config_1.default.semana.findFirst({
                where: {
                    fecha_inicio: {
                        gte: new Date(year, 0, 1),
                    },
                },
            });
            return week;
        });
    }
    createUnit(weekNumber, currentStartDate, currentEndDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const week = yield prisma_config_1.default.semana.create({
                data: {
                    codigo: weekNumber,
                    fecha_inicio: currentStartDate,
                    fecha_fin: currentEndDate,
                },
            });
            return week;
        });
    }
}
exports.prismaWeekRepository = new PrismaWeekRepository();

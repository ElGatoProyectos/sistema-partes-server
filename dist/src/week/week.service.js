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
exports.weekService = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const http_response_1 = require("./../common/http.response");
const prisma_week_repository_1 = require("./prisma-week.repository");
class WeekService {
    createWeek(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextYear = year + 1;
            const weekResponse = yield exports.weekService.findByYear(year);
            if (!weekResponse.success) {
                // console.log("entro a crear hoy y mañana");
                this.createWeekThisYearAndNext(year);
                return http_response_1.httpResponse.SuccessResponse("Semanas creadas para este y el siguiente año.");
            }
            const nextYearResponse = yield exports.weekService.findByYear(nextYear);
            if (!nextYearResponse.success) {
                // console.log("entro a crear mañana");
                const lastWeek = yield prisma_week_repository_1.prismaWeekRepository.findLastWeek();
                if (!lastWeek) {
                    return http_response_1.httpResponse.BadRequestException("no hay nada");
                }
                this.createWeekOfYear(lastWeek.fecha_fin);
                return http_response_1.httpResponse.SuccessResponse("Semanas creadas para el siguiente año.");
            }
            // console.log("hay para ambos");
            return http_response_1.httpResponse.SuccessResponse("Las semanas ya existen para ambos años.");
        });
    }
    addDays(date, days) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }
    createWeekThisYearAndNext(year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let currentStartDate = new Date(year, 0, 1); // Año, mes (0 es enero), día (1)
                let weekNumber = 1;
                let week;
                for (let i = 0; i < 104; i++) {
                    let currentYear = currentStartDate.getFullYear();
                    // Calcula el fin de la semana (6 días después del inicio)
                    const currentEndDate = this.addDays(currentStartDate, 6);
                    if (weekNumber > 52) {
                        weekNumber = 1;
                    }
                    week = weekNumber.toString().padStart(2, "0");
                    const result = yield prisma_week_repository_1.prismaWeekRepository.createUnit(String(currentYear) + "." + week, currentStartDate, currentEndDate);
                    if (!result) {
                        return http_response_1.httpResponse.InternalServerErrorException(`Error al crear la semana número ${weekNumber}`);
                    }
                    currentStartDate = this.addDays(currentStartDate, 7);
                    weekNumber++;
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear las semanas", error);
            }
        });
    }
    createWeekOfYear(fecha_fin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let currentStartDate = this.addDays(fecha_fin, 1); // Año, mes (0 es enero), día (1)
                let weekNumber = 1;
                let week;
                let currentYear = currentStartDate.getFullYear() + 1;
                for (let i = 0; i < 52; i++) {
                    // Calcula el fin de la semana (6 días después del inicio)
                    const currentEndDate = this.addDays(currentStartDate, 6);
                    week = weekNumber.toString().padStart(2, "0");
                    const result = yield prisma_week_repository_1.prismaWeekRepository.createUnit(String(currentYear) + "." + week, currentStartDate, currentEndDate);
                    if (!result) {
                        return http_response_1.httpResponse.InternalServerErrorException(`Error al crear la semana número ${weekNumber}`);
                    }
                    currentStartDate = this.addDays(currentStartDate, 7);
                    weekNumber++;
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear las semanas", error);
            }
        });
    }
    findByYear(year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const weekResponse = yield prisma_week_repository_1.prismaWeekRepository.findByDate(year);
                if (!weekResponse) {
                    return http_response_1.httpResponse.NotFoundException("El año no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Año encontrada", weekResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Año", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const weekResponse = yield prisma_week_repository_1.prismaWeekRepository.findForDate(date);
                if (!weekResponse) {
                    return http_response_1.httpResponse.NotFoundException("No se encontró una semana para la fecha que está pasando");
                }
                return http_response_1.httpResponse.SuccessResponse("Se encontró la semana", weekResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Semana", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.weekService = new WeekService();

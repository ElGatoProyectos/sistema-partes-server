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
Object.defineProperty(exports, "__esModule", { value: true });
exports.weekController = void 0;
const week_service_1 = require("./week.service");
class WeekController {
    findWeek(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            // const nuevaFecha = new Date(2024, 0, 5); // Año 2024, mes 0 (enero), día 5
            const result = yield week_service_1.weekService.findByDate(date);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.weekController = new WeekController();

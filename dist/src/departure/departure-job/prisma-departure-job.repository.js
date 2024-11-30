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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaDepartureJobRepository = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class PrismaDepartureJobRepository {
    findAll(skip, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let details = [];
            let total;
            [details, total] = yield prisma_config_1.default.$transaction([
                prisma_config_1.default.detalleTrabajoPartida.findMany({
                    skip,
                    take: data.queryParams.limit,
                    include: {
                        Trabajo: true,
                        Partida: true,
                    },
                }),
                prisma_config_1.default.detalleTrabajoPartida.count({}),
            ]);
            const detailsDepartureJob = details.map((item) => {
                const { Trabajo } = item, data = __rest(item, ["Trabajo"]);
                const { Partida } = item;
                return {
                    trabajo: Trabajo,
                    partida: Partida,
                    cantidad_total: item.cantidad_total,
                };
            });
            return { detailsDepartureJob, total };
        });
    }
    createDetailDepartureJob(job_id, departure_Id, metrado) {
        return __awaiter(this, void 0, void 0, function* () {
            const departure_job = yield prisma_config_1.default.detalleTrabajoPartida.create({
                data: {
                    trabajo_id: job_id,
                    partida_id: departure_Id,
                    cantidad_total: metrado,
                },
            });
            return departure_job;
        });
    }
}
exports.prismaDepartureJobRepository = new PrismaDepartureJobRepository();

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
exports.unitController = void 0;
const unit_service_1 = require("./unit.service");
const multer_1 = __importDefault(require("multer"));
const http_response_1 = require("@/common/http.response");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class UnitController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const project_id = request.params.project_id;
            const tokenWithBearer = request.headers.authorization;
            if (tokenWithBearer) {
                const result = yield unit_service_1.unitService.createUnit(data, tokenWithBearer, +project_id);
                if (!result.success) {
                    response.status(result.statusCode).json(result);
                }
                else {
                    response.status(result.statusCode).json(result);
                }
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al crear la unidad");
                response.status(result.statusCode).json(result);
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const tokenWithBearer = request.headers.authorization;
            const project_id = request.params.project_id;
            const idUnit = Number(request.params.id);
            if (tokenWithBearer) {
                const result = yield unit_service_1.unitService.updateUnit(data, idUnit, tokenWithBearer, +project_id);
                if (!result.success) {
                    response.status(result.statusCode).json(result);
                }
                else {
                    response.status(result.statusCode).json(result);
                }
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al modiciar la unidad");
                response.status(result.statusCode).json(result);
            }
        });
    }
    updateStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUnit = Number(request.params.id);
            const result = yield unit_service_1.unitService.updateStatusUnit(idUnit);
            response.status(result.statusCode).json(result);
        });
    }
    findByIdUnit(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUnit = Number(request.params.id);
            const result = yield unit_service_1.unitService.findById(idUnit);
            response.status(result.statusCode).json(result);
        });
    }
    findByName(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const project_id = request.params.project_id;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const name = request.query.name;
            const result = yield unit_service_1.unitService.findByName(name, paginationOptions, +project_id);
            response.status(result.statusCode).json(result);
        });
    }
    allResoursesCategories(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const project_id = request.params.project_id;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const result = yield unit_service_1.unitService.findAll(paginationOptions, +project_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.unitController = new UnitController();

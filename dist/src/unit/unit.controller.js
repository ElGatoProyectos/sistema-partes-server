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
const auth_service_1 = require("@/auth/auth.service");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class UnitController {
    constructor() {
        this.unitReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("unit-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return response.status(500).json({ error: "Error uploading file" });
                }
                const token = request.get("Authorization");
                const project_id = request.get("project-id");
                const responseValidate = auth_service_1.authService.verifyRolProjectAdminUser(token);
                if (!(responseValidate === null || responseValidate === void 0 ? void 0 : responseValidate.success)) {
                    return response.status(401).json(responseValidate);
                }
                else {
                    const file = request.file;
                    if (!file) {
                        return response.status(400).json({ error: "No se subió archivo" });
                    }
                    try {
                        const serviceResponse = yield unit_service_1.unitService.registerUnitMasive(file, +project_id, token);
                        response.status(serviceResponse.statusCode).json(serviceResponse);
                    }
                    catch (error) {
                        response.status(500).json(error);
                    }
                }
            }));
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const project_id = request.get("project-id");
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
            const project_id = request.get("project-id");
            const unit_id = Number(request.params.id);
            if (tokenWithBearer) {
                const result = yield unit_service_1.unitService.updateUnit(data, unit_id, tokenWithBearer, +project_id);
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
    allResoursesCategories(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const search = request.query.search;
            const project_id = request.get("project-id");
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    search: search,
                },
            };
            const result = yield unit_service_1.unitService.findAll(paginationOptions, +project_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.unitController = new UnitController();

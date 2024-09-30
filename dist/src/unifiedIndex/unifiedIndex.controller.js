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
exports.unifiedIndexController = void 0;
const unifiedIndex_service_1 = require("./unifiedIndex.service");
const multer_1 = __importDefault(require("multer"));
const http_response_1 = require("@/common/http.response");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class UnifiedIndexController {
    constructor() {
        this.unifiedIndexReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("unified-index-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return response.status(500).json({ error: "Error uploading file" });
                }
                const file = request.file;
                if (!file) {
                    return response.status(400).json({ error: "No se subió archivo" });
                }
                try {
                    const company_id = Number(request.params.id);
                    const serviceResponse = yield unifiedIndex_service_1.unifiedIndexService.registerUnifiedIndexMasive(file, +company_id);
                    response.status(serviceResponse.statusCode).json(serviceResponse);
                }
                catch (error) {
                    response.status(500).json(error);
                }
            }));
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const tokenWithBearer = request.headers.authorization;
            if (tokenWithBearer) {
                const result = yield unifiedIndex_service_1.unifiedIndexService.createUnifiedIndex(data, tokenWithBearer);
                if (!result.success) {
                    response.status(result.statusCode).json(result);
                }
                else {
                    response.status(result.statusCode).json(result);
                }
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al crear el indice unificado");
                response.status(result.statusCode).json(result);
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const idResourseCategory = Number(request.params.id);
            const tokenWithBearer = request.headers.authorization;
            if (tokenWithBearer) {
                const result = yield unifiedIndex_service_1.unifiedIndexService.updateUnifiedIndex(data, idResourseCategory, tokenWithBearer);
                if (!result.success) {
                    response.status(result.statusCode).json(result);
                }
                else {
                    response.status(result.statusCode).json(result);
                }
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al modificar el indice unificado");
                response.status(result.statusCode).json(result);
            }
        });
    }
    updateStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idResourseCategory = Number(request.params.id);
            const result = yield unifiedIndex_service_1.unifiedIndexService.updateStatusUnifiedIndex(idResourseCategory);
            response.status(result.statusCode).json(result);
        });
    }
    findByIdUnifiedIndex(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idResourseCategory = Number(request.params.id);
            const result = yield unifiedIndex_service_1.unifiedIndexService.findById(idResourseCategory);
            response.status(result.statusCode).json(result);
        });
    }
    findByName(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const name = request.query.name;
            const result = yield unifiedIndex_service_1.unifiedIndexService.findByName(name, paginationOptions);
            response.status(result.statusCode).json(result);
        });
    }
    allUnifiedIndex(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const result = yield unifiedIndex_service_1.unifiedIndexService.findAll(paginationOptions);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.unifiedIndexController = new UnifiedIndexController();

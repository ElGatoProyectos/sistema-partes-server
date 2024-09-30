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
exports.productionUnitController = void 0;
const http_response_1 = require("@/common/http.response");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
const auth_service_1 = require("@/auth/auth.service");
const production_unit_constant_1 = require("./models/production-unit.constant");
const production_unit_dto_1 = require("./dto/production-unit.dto");
const production_unit_service_1 = require("./production-unit.service");
const update_production_unit_dto_1 = require("./dto/update-production-unit.dto");
const validator_1 = __importDefault(require("validator"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class ProductionUnitController {
    constructor() {
        this.create = (request, response) => __awaiter(this, void 0, void 0, function* () {
            upload.single(production_unit_constant_1.ProductionUnitMulterProperties.field)(request, response, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    const customError = http_response_1.httpResponse.BadRequestException("Error al procesar la imagen de la Unidad de Producción", error);
                    response.status(customError.statusCode).json(customError);
                }
                else {
                    try {
                        const responseValidate = auth_service_1.authService.verifyRolProject(request.get("Authorization"));
                        const project_id = request.get("project-id");
                        if (!(responseValidate === null || responseValidate === void 0 ? void 0 : responseValidate.success)) {
                            return response.status(401).json(responseValidate);
                        }
                        else {
                            production_unit_dto_1.prouductionUnitDto.parse(request.body);
                            if (!validator_1.default.isNumeric(project_id)) {
                                const customError = http_response_1.httpResponse.BadRequestException("El id del projecto debe ser numérico", error);
                                response.status(customError.statusCode).json(customError);
                            }
                            else {
                                const data = request.body;
                                const result = yield production_unit_service_1.productionUnitService.createProductionUnit(data, +project_id);
                                if (!result.success) {
                                    response.status(result.statusCode).json(result);
                                }
                                else {
                                    const project = result.payload;
                                    if (request.file) {
                                        const id = project.id;
                                        const direction = path_1.default.join(app_root_path_1.default.path, "static", production_unit_constant_1.ProductionUnitMulterProperties.folder);
                                        const ext = ".png";
                                        const fileName = `${production_unit_constant_1.ProductionUnitMulterProperties.folder}_${id}${ext}`;
                                        const filePath = path_1.default.join(direction, fileName);
                                        (0, sharp_1.default)(request.file.buffer)
                                            .resize({ width: 800 })
                                            .toFormat("png")
                                            .toFile(filePath, (err) => {
                                            if (err) {
                                                const customError = http_response_1.httpResponse.BadRequestException("Error al guardar la imagen de la Unidad de Producción", err);
                                                response
                                                    .status(customError.statusCode)
                                                    .json(customError);
                                            }
                                            else {
                                                response.status(result.statusCode).json(result);
                                            }
                                        });
                                    }
                                    else {
                                        response.status(result.statusCode).json(result);
                                    }
                                }
                            }
                        }
                    }
                    catch (error) {
                        const customError = http_response_1.httpResponse.BadRequestException("Error al validar los campos de la Unidad de Producción", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.update = (request, response) => __awaiter(this, void 0, void 0, function* () {
            upload.single(production_unit_constant_1.ProductionUnitMulterProperties.field)(request, response, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    const customError = http_response_1.httpResponse.BadRequestException("Error al procesar la imagen ", error);
                    response.status(customError.statusCode).json(customError);
                }
                else {
                    try {
                        const responseValidate = auth_service_1.authService.verifyRolProject(request.get("Authorization"));
                        if (!(responseValidate === null || responseValidate === void 0 ? void 0 : responseValidate.success)) {
                            return response.status(401).json(responseValidate);
                        }
                        else {
                            update_production_unit_dto_1.prouductionUnitUpdateDto.parse(request.body);
                            const data = request.body;
                            const production_unit_id = request.params.id;
                            const project_id = request.get("project-id");
                            if (!validator_1.default.isNumeric(production_unit_id) ||
                                !validator_1.default.isNumeric(project_id)) {
                                const customError = http_response_1.httpResponse.BadRequestException("Los id deben ser numéricos", error);
                                response.status(customError.statusCode).json(customError);
                            }
                            else {
                                const result = yield production_unit_service_1.productionUnitService.updateProductionUnit(data, +production_unit_id, +project_id);
                                if (!result.success) {
                                    response.status(result.statusCode).json(result);
                                }
                                else {
                                    const project = result.payload;
                                    if (request.file) {
                                        const id = project.id;
                                        const direction = path_1.default.join(app_root_path_1.default.path, "static", production_unit_constant_1.ProductionUnitMulterProperties.folder);
                                        const ext = ".png";
                                        const fileName = `${production_unit_constant_1.ProductionUnitMulterProperties.folder}_${id}${ext}`;
                                        const filePath = path_1.default.join(direction, fileName);
                                        (0, sharp_1.default)(request.file.buffer)
                                            .resize({ width: 800 })
                                            .toFormat("png")
                                            .toFile(filePath, (err) => {
                                            if (err) {
                                                const customError = http_response_1.httpResponse.BadRequestException("Error al guardar la imagen de la Unidad de Producción", err);
                                                response
                                                    .status(customError.statusCode)
                                                    .json(customError);
                                            }
                                            else {
                                                response.status(result.statusCode).json(result);
                                            }
                                        });
                                    }
                                    else {
                                        response.status(result.statusCode).json(result);
                                    }
                                }
                            }
                        }
                    }
                    catch (error) {
                        const customError = http_response_1.httpResponse.BadRequestException("Error al validar los campos ", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.findImage = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const idProject = Number(request.params.id);
            const result = yield production_unit_service_1.productionUnitService.findIdImage(idProject);
            if (typeof result.payload === "string") {
                promises_1.default.readFile(result.payload);
                response.sendFile(result.payload);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
        this.findById = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const idProject = request.params.id;
            const result = yield production_unit_service_1.productionUnitService.findById(+idProject);
            response.status(result.statusCode).json(result);
        });
        this.findByName = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const name = request.query.name;
            const result = yield production_unit_service_1.productionUnitService.findByName(name, paginationOptions);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
        this.findAll = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const idCompany = request.params.id;
            const result = yield production_unit_service_1.productionUnitService.findAll(paginationOptions);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
        this.productionUnitReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("production-unit-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return response.status(500).json({ error: "Error uploading file" });
                }
                // const project_id = Number(request.params.project_id);
                const project_id = request.get("project-id");
                const file = request.file;
                if (!file) {
                    return response.status(400).json({ error: "No se subió archivo" });
                }
                try {
                    const serviceResponse = yield production_unit_service_1.productionUnitService.registerProductionUnitMasive(file, +project_id);
                    response.status(serviceResponse.statusCode).json(serviceResponse);
                }
                catch (error) {
                    response.status(500).json(error);
                }
            }));
        });
    }
    updateStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idProject = Number(request.params.id);
            const result = yield production_unit_service_1.productionUnitService.updateStatusProject(idProject);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.productionUnitController = new ProductionUnitController();

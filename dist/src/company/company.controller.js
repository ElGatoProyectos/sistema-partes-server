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
exports.companyController = void 0;
const company_service_1 = require("./company.service");
const http_response_1 = require("@/common/http.response");
const company_constant_1 = require("./models/company.constant");
const auth_service_1 = require("@/auth/auth.service");
const companydto_1 = require("./dto/companydto");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const sharp_1 = __importDefault(require("sharp"));
const companyupdatedto_1 = require("./dto/companyupdatedto");
const promises_1 = __importDefault(require("fs/promises"));
const validator_1 = __importDefault(require("validator"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class CompanyController {
    constructor() {
        this.create = (request, response) => __awaiter(this, void 0, void 0, function* () {
            upload.single(company_constant_1.CompanyMulterProperties.field)(request, response, (error) => __awaiter(this, void 0, void 0, function* () {
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
                            companydto_1.empresaDto.parse(request.body);
                            const tokenWithBearer = request.headers.authorization;
                            if (tokenWithBearer) {
                                const data = request.body;
                                const result = yield company_service_1.companyService.createCompanyWithTokenUser(data, tokenWithBearer);
                                if (!result.success) {
                                    response.status(result.statusCode).json(result);
                                }
                                else {
                                    const project = result.payload;
                                    if (request.file) {
                                        const id = project.id;
                                        const direction = path_1.default.join(app_root_path_1.default.path, "static", company_constant_1.CompanyMulterProperties.folder);
                                        const ext = ".png";
                                        const fileName = `${company_constant_1.CompanyMulterProperties.folder}_${id}${ext}`;
                                        const filePath = path_1.default.join(direction, fileName);
                                        (0, sharp_1.default)(request.file.buffer)
                                            .resize({ width: 800 })
                                            .toFormat("png")
                                            .toFile(filePath, (err) => {
                                            if (err) {
                                                const customError = http_response_1.httpResponse.BadRequestException("Error al guardar la foto de la empresa", err);
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
                            else {
                                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al crear el usuario");
                                response.status(result.statusCode).json(result);
                            }
                        }
                    }
                    catch (error) {
                        const customError = http_response_1.httpResponse.BadRequestException("Error al validar los campos de la empresa ", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.update = (request, response) => __awaiter(this, void 0, void 0, function* () {
            upload.single(company_constant_1.CompanyMulterProperties.field)(request, response, (error) => __awaiter(this, void 0, void 0, function* () {
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
                            companyupdatedto_1.empresaUpdateDto.parse(request.body);
                            const tokenWithBearer = request.headers.authorization;
                            const data = request.body;
                            const company_id = request.params.id;
                            if (!validator_1.default.isNumeric(company_id)) {
                                const customError = http_response_1.httpResponse.BadRequestException("El id del projecto debe ser numérico", error);
                                response.status(customError.statusCode).json(customError);
                            }
                            else {
                                if (tokenWithBearer) {
                                    const result = yield company_service_1.companyService.updateCompanyWithTokenUser(data, +company_id, tokenWithBearer);
                                    if (!result.success) {
                                        response.status(result.statusCode).json(result);
                                    }
                                    else {
                                        const project = result.payload;
                                        if (request.file) {
                                            const id = project.id;
                                            const direction = path_1.default.join(app_root_path_1.default.path, "static", company_constant_1.CompanyMulterProperties.folder);
                                            const ext = ".png";
                                            const fileName = `${company_constant_1.CompanyMulterProperties.folder}_${id}${ext}`;
                                            const filePath = path_1.default.join(direction, fileName);
                                            (0, sharp_1.default)(request.file.buffer)
                                                .resize({ width: 800 })
                                                .toFormat("png")
                                                .toFile(filePath, (err) => {
                                                if (err) {
                                                    const customError = http_response_1.httpResponse.BadRequestException("Error al actualizar la imagen de la empresa", err);
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
                                else {
                                    const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al crear el usuario");
                                    response.status(result.statusCode).json(result);
                                }
                            }
                        }
                    }
                    catch (error) {
                        const customError = http_response_1.httpResponse.BadRequestException("Error al validar los campos de la empresa ", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.findImage = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const idProject = Number(request.params.id);
            const result = yield company_service_1.companyService.findIdImage(idProject);
            if (typeof result.payload === "string") {
                promises_1.default.readFile(result.payload);
                response.sendFile(result.payload);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
    }
    updateStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCompany = Number(request.params.id);
            const result = yield company_service_1.companyService.updateStatusCompany(idCompany);
            response.status(result.statusCode).json(result);
        });
    }
    findByIdCompany(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idCompany = Number(request.params.id);
            const result = yield company_service_1.companyService.findById(idCompany);
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
            const result = yield company_service_1.companyService.searchByName(name, paginationOptions);
            response.status(result.statusCode).json(result);
        });
    }
    allCompanies(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const result = yield company_service_1.companyService.findAll(paginationOptions);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.companyController = new CompanyController();

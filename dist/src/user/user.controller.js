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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const http_response_1 = require("@/common/http.response");
const company_constant_1 = require("@/company/models/company.constant");
const multer_1 = __importDefault(require("multer"));
const auth_service_1 = require("@/auth/auth.service");
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const sharp_1 = __importDefault(require("sharp"));
const userAndCompany_dto_1 = require("./dto/userAndCompany.dto");
const userAndCompanyUpdate_dto_1 = require("./dto/userAndCompanyUpdate.dto");
//los archivos subidos serán almacenados directamente en la memoria (RAM) en lugar de ser guardados en el disco duro.
// esto es útil por si lo querés analizar o guardar en algun lugar
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class UserController {
    constructor() {
        this.createUserandCompany = (request, response, nextFunction) => __awaiter(this, void 0, void 0, function* () {
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
                            userAndCompany_dto_1.userAndCompanyDto.parse(request.body);
                            const data = request.body;
                            const result = yield user_service_1.userService.createUserAndCompany(data);
                            if (!result.success) {
                                response.status(result.statusCode).json(result);
                            }
                            else {
                                const responseUserAndCompany = result.payload;
                                if (request.file) {
                                    const id = responseUserAndCompany.empresa.id;
                                    const direction = path_1.default.join(app_root_path_1.default.path, "static", company_constant_1.CompanyMulterProperties.folder);
                                    const ext = ".png";
                                    const fileName = `${company_constant_1.CompanyMulterProperties.folder}_${id}${ext}`;
                                    const filePath = path_1.default.join(direction, fileName);
                                    (0, sharp_1.default)(request.file.buffer)
                                        .resize({ width: 800 })
                                        .toFormat("png")
                                        .toFile(filePath, (err) => {
                                        if (err) {
                                            const customError = http_response_1.httpResponse.BadRequestException("Error al guardar la imagen de la empresa", err);
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
                    catch (error) {
                        const customError = http_response_1.httpResponse.BadRequestException("Error al validar los campos al crear el usuario y la empresa", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.updateUserandCompany = (request, response, nextFunction) => __awaiter(this, void 0, void 0, function* () {
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
                            const user_id = Number(request.params.id);
                            userAndCompanyUpdate_dto_1.userAndCompanyUpdateDto.parse(request.body);
                            const data = request.body;
                            const result = yield user_service_1.userService.updateUserAndCompany(data, user_id);
                            if (!result.success) {
                                response.status(result.statusCode).json(result);
                            }
                            else {
                                const responseUserAndCompany = result.payload;
                                if (request.file) {
                                    const id = responseUserAndCompany.empresa.id;
                                    const direction = path_1.default.join(app_root_path_1.default.path, "static", company_constant_1.CompanyMulterProperties.folder);
                                    const ext = ".png";
                                    const fileName = `${company_constant_1.CompanyMulterProperties.folder}_${id}${ext}`;
                                    const filePath = path_1.default.join(direction, fileName);
                                    (0, sharp_1.default)(request.file.buffer)
                                        .resize({ width: 800 })
                                        .toFormat("png")
                                        .toFile(filePath, (err) => {
                                        if (err) {
                                            const customError = http_response_1.httpResponse.BadRequestException("Error al guardar la imagen de la empresa", err);
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
                    catch (error) {
                        const customError = http_response_1.httpResponse.BadRequestException("Error al validar los campos al crear el usuario y la empresa", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
    }
    createUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const result = yield user_service_1.userService.createUser(data);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
    }
    createUserAndSearchToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const tokenWithBearer = request.headers.authorization;
            if (tokenWithBearer) {
                const result = yield user_service_1.userService.usersToCompany(data, tokenWithBearer);
                if (!result.success) {
                    response.status(result.statusCode).json(result);
                }
                else {
                    response.status(result.statusCode).json(result);
                }
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al crear el usuario");
                response.status(result.statusCode).json(result);
            }
        });
    }
    createPermissions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const user_id = Number(request.params.id);
            const rol_id = Number(request.params.rol_id);
            const project_id = Number(request.params.project_id);
            let permissions = {
                user_id: user_id,
                rol_id: rol_id,
                project_id: project_id,
                section: data.section,
                actions: data.actions,
            };
            const result = yield user_service_1.userService.createPermissions(permissions);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const idUser = Number(request.params.project_id);
            const result = yield user_service_1.userService.updateUser(data, idUser);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
    }
    updateStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUser = Number(request.params.id);
            const result = yield user_service_1.userService.updateStatusUser(idUser);
            response.status(result.statusCode).json(result);
        });
    }
    updateRol(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const result = yield user_service_1.userService.updateRolUser(data.idUser, data.idRol);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
    }
    findByIdUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUser = Number(request.params.id);
            const result = yield user_service_1.userService.findById(idUser);
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
            //si buscaba como request.body no me llegaba bien para luego buscar
            const name = request.query.name;
            const result = yield user_service_1.userService.findByName(name, paginationOptions);
            response.status(result.statusCode).json(result);
        });
    }
    allUsers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const name = request.query.name;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    name,
                },
            };
            const tokenWithBearer = request.headers.authorization;
            if (tokenWithBearer) {
                const result = yield user_service_1.userService.findAll(paginationOptions, tokenWithBearer);
                response.status(result.statusCode).json(result);
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al buscar todos los Usuarios");
                response.status(result.statusCode).json(result);
            }
        });
    }
    allUsersForCompany(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const name = request.query.name;
            const user_id = Number(request.params.id);
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    name,
                },
            };
            const result = yield user_service_1.userService.findAllUserCompany(paginationOptions, user_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.userController = new UserController();

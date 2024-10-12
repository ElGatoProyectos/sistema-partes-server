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
exports.projectController = void 0;
const http_response_1 = require("@/common/http.response");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const sharp_1 = __importDefault(require("sharp"));
const project_service_1 = require("./project.service");
const project_constant_1 = require("@/project/models/project.constant");
const project_dto_1 = require("./dto/project.dto");
const promises_1 = __importDefault(require("fs/promises"));
const proyectUpdate_dto_1 = require("./dto/proyectUpdate.dto");
const auth_service_1 = require("@/auth/auth.service");
//los archivos subidos serán almacenados directamente en la memoria (RAM) en lugar de ser guardados en el disco duro.
// esto es útil por si lo querés analizar o guardar en algun lugar
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class ProjectController {
    constructor() {
        //[note] DEBE SER ASI SINO TE TOMA UPLOAD COMO UNDEFINED
        this.create = (request, response, nextFunction) => __awaiter(this, void 0, void 0, function* () {
            //se utiliza para manejar la subida de un solo archivo con el nombre de campo especificado
            //este método devuelve una función middleware
            //es una funcion q devuelve nuna funcion eso es por eso que puedes invocarla inmediatamente después de su creación.
            //entonces preparas a multer para que procese el archivo y luego ejecutas una funcion
            upload.single(project_constant_1.ProjectMulterProperties.field)(request, response, 
            //nextFunction,
            (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    const customError = http_response_1.httpResponse.BadRequestException("Error al procesar la imagen ", error);
                    response.status(customError.statusCode).json(customError);
                }
                else {
                    try {
                        // se hace asi y no desde la clase del middleware xq sino pierdo los valores del request cuando verifico
                        //despues los valores
                        const responseValidate = auth_service_1.authService.verifyRolProjectAdminUser(request.get("Authorization"));
                        if (!(responseValidate === null || responseValidate === void 0 ? void 0 : responseValidate.success)) {
                            return response.status(401).json(responseValidate);
                        }
                        else {
                            project_dto_1.proyectoDto.parse(request.body);
                            const tokenWithBearer = request.headers.authorization;
                            const data = request.body;
                            if (tokenWithBearer) {
                                const result = yield project_service_1.projectService.createProject(data, tokenWithBearer);
                                //en controlador si hay if tiene q tener su else
                                if (!result.success) {
                                    response.status(result.statusCode).json(result);
                                }
                                else {
                                    const project = result.payload;
                                    if (request.file) {
                                        const id = project.id;
                                        const direction = path_1.default.join(app_root_path_1.default.path, "static", project_constant_1.ProjectMulterProperties.folder);
                                        const ext = ".png";
                                        const fileName = `${project_constant_1.ProjectMulterProperties.folder}_${id}${ext}`;
                                        //se hace de nuevo el path.join xq cmbina el directorio y el nombre del archivo para obtener la ruta
                                        //completa donde se guardará el archivo. Es mejor preparar la ruta antes x si el día de mañana cambias
                                        //de carpeta donde van a guardar
                                        const filePath = path_1.default.join(direction, fileName);
                                        (0, sharp_1.default)(request.file.buffer)
                                            .resize({ width: 800 })
                                            .toFormat("png")
                                            .toFile(filePath, (err) => {
                                            if (err) {
                                                const customError = http_response_1.httpResponse.BadRequestException("Error al guardar la imagen", err);
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
                                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al crear el proyecto");
                                response.status(result.statusCode).json(result);
                            }
                        }
                    }
                    catch (error) {
                        const customError = http_response_1.httpResponse.BadRequestException(" Error al validar los campos ", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.updateProject = (request, response) => __awaiter(this, void 0, void 0, function* () {
            upload.single(project_constant_1.ProjectMulterProperties.field)(request, response, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    const customError = http_response_1.httpResponse.BadRequestException("Error al procesar la imagen ", error);
                    response.status(customError.statusCode).json(customError);
                }
                else {
                    try {
                        // se hace asi y no desde la clase del middleware xq sino pierdo los valores del request cuando verifico
                        //despues los valores
                        const responseValidate = auth_service_1.authService.verifyRolProjectAdminUser(request.get("Authorization"));
                        if (!(responseValidate === null || responseValidate === void 0 ? void 0 : responseValidate.success)) {
                            return response.status(401).json(responseValidate);
                        }
                        else {
                            proyectUpdate_dto_1.proyectoDtoUpdate.parse(request.body);
                            const tokenWithBearer = request.headers.authorization;
                            const data = request.body;
                            if (tokenWithBearer) {
                                const idProject = Number(request.params.id);
                                const result = yield project_service_1.projectService.updateProject(data, idProject, tokenWithBearer);
                                if (!result.success) {
                                    response.status(result.statusCode).json(result);
                                }
                                else {
                                    const project = result.payload;
                                    if (request.file) {
                                        const id = project.id;
                                        const direction = path_1.default.join(app_root_path_1.default.path, "static", project_constant_1.ProjectMulterProperties.folder);
                                        const ext = ".png";
                                        const fileName = `${project_constant_1.ProjectMulterProperties.folder}_${id}${ext}`;
                                        //se hace de nuevo el path.join xq cmbina el directorio y el nombre del archivo para obtener la ruta
                                        //completa donde se guardará el archivo. Es mejor preparar la ruta antes x si el día de mañana cambias
                                        //de carpeta donde van a guardar
                                        const filePath = path_1.default.join(direction, fileName);
                                        (0, sharp_1.default)(request.file.buffer)
                                            .resize({ width: 800 })
                                            .toFormat("png")
                                            .toFile(filePath, (err) => {
                                            if (err) {
                                                const customError = http_response_1.httpResponse.BadRequestException("Error al guardar la imagen", err);
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
                        const customError = http_response_1.httpResponse.BadRequestException(" Error al validar los campos ", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.findImage = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const idProject = Number(request.params.id);
            const result = yield project_service_1.projectService.findIdImage(idProject);
            if (typeof result.payload === "string") {
                promises_1.default.readFile(result.payload);
                response.sendFile(result.payload);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
        this.findByIdProject = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const idProject = request.params.id;
            const result = yield project_service_1.projectService.findById(+idProject);
            response.status(result.statusCode).json(result);
        });
        this.findByName = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const state = request.query.state;
            const name = request.query.name;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    name: name,
                    state: state,
                },
            };
            //si buscaba como request.body no me llegaba bien para luego buscar
            const result = yield project_service_1.projectService.findByName(paginationOptions);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
        this.findAllProjectsXCompany = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const tokenWithBearer = request.headers.authorization;
            const name = request.query.name;
            const state = request.query.state;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    name: name,
                    state: state,
                },
            };
            // const user_id = request.params.id;
            if (tokenWithBearer) {
                const result = yield project_service_1.projectService.findAllProjectsXCompany(tokenWithBearer, paginationOptions);
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
    updateStatus(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idProject = Number(request.params.id);
            const result = yield project_service_1.projectService.updateStatusProject(idProject);
            response.status(result.statusCode).json(result);
        });
    }
    updateState(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idProject = Number(request.params.id);
            // const data = request.body;
            const project_state = request.query.state;
            if (project_state) {
                const result = yield project_service_1.projectService.updateStateProject(idProject, project_state);
                response.status(result.statusCode).json(result);
            }
            else {
                const result = http_response_1.httpResponse.BadRequestException("Falta el campo estado para poder hacerse la acción");
                response.status(result.statusCode).json(result);
            }
        });
    }
    updateColors(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const project_id = Number(request.params.project_id);
            const data = request.body;
            const result = yield project_service_1.projectService.updateColorsProject(project_id, data);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.projectController = new ProjectController();

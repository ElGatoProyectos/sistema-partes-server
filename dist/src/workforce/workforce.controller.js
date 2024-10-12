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
exports.workforceController = void 0;
const multer_1 = __importDefault(require("multer"));
const workforce_service_1 = require("./workforce.service");
const http_response_1 = require("@/common/http.response");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class WorkforceController {
    constructor() {
        this.workforceReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("workforce-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return response.status(500).json({ error: "Error al leer el archivo" });
                }
                // const project_id = Number(request.params.project_id);
                const project_id = request.get("project-id");
                const file = request.file;
                if (!file) {
                    return response.status(400).json({ error: "No se subió archivo" });
                }
                try {
                    const tokenWithBearer = request.headers.authorization;
                    if (!tokenWithBearer) {
                        return http_response_1.httpResponse.BadRequestException("No se encontró nada en Authorization ");
                    }
                    const serviceResponse = yield workforce_service_1.workforceService.registerWorkforceMasive(file, +project_id, tokenWithBearer);
                    response.status(serviceResponse.statusCode).json(serviceResponse);
                }
                catch (error) {
                    response.status(500).json(error);
                }
            }));
        });
    }
}
exports.workforceController = new WorkforceController();

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
exports.resourceController = void 0;
const multer_1 = __importDefault(require("multer"));
const resources_service_1 = require("./resources.service");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class ResourceController {
    constructor() {
        this.resourceReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("resource-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
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
                    const serviceResponse = yield resources_service_1.resourceService.registerResourceMasive(file, +project_id);
                    response.status(serviceResponse.statusCode).json(serviceResponse);
                }
                catch (error) {
                    response.status(500).json(error);
                }
            }));
        });
    }
}
exports.resourceController = new ResourceController();

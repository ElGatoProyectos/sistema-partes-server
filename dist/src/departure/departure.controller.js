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
exports.departureController = void 0;
const auth_service_1 = require("@/auth/auth.service");
const multer_1 = __importDefault(require("multer"));
const departure_service_1 = require("./departure.service");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class DepartureController {
    constructor() {
        this.departureReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("departure-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
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
                        const serviceResponse = yield departure_service_1.departureService.registerDepartureMasive(file, +project_id, token);
                        response.status(serviceResponse.statusCode).json(serviceResponse);
                    }
                    catch (error) {
                        response.status(500).json(error);
                    }
                }
            }));
        });
    }
    findById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const departure_id = Number(request.params.id);
            const result = yield departure_service_1.departureService.findById(departure_id);
            response.status(result.statusCode).json(result);
        });
    }
    allDepartures(request, response) {
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
            const result = yield departure_service_1.departureService.findAll(paginationOptions, +project_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.departureController = new DepartureController();
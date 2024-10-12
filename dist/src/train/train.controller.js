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
exports.trainController = void 0;
const train_service_1 = require("./train.service");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class TrainController {
    constructor() {
        this.trainReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("train-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
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
                    const serviceResponse = yield train_service_1.trainService.registerTrainMasive(file, +project_id);
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
            const project_id = request.get("project-id");
            const result = yield train_service_1.trainService.createTrain(data, +project_id);
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
            const train_id = Number(request.params.id);
            const project_id = request.get("project-id");
            const result = yield train_service_1.trainService.updateTrain(data, train_id, project_id);
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
            const idTrain = Number(request.params.id);
            const result = yield train_service_1.trainService.updateStatusTrain(idTrain);
            response.status(result.statusCode).json(result);
        });
    }
    findByIdTrain(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idTrain = Number(request.params.id);
            const result = yield train_service_1.trainService.findById(idTrain);
            response.status(result.statusCode).json(result);
        });
    }
    allTrains(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const project_id = request.get("project-id");
            // const project_id = Number(request.params.project_id);
            const search = request.query.search;
            const codigo = request.query.codigo;
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    search: search,
                },
            };
            const result = yield train_service_1.trainService.findAll(paginationOptions, project_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.trainController = new TrainController();

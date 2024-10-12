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
exports.jobController = void 0;
const multer_1 = __importDefault(require("multer"));
const job_service_1 = require("./job.service");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class JobController {
    constructor() {
        this.jobReadExcel = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // Usando multer para manejar la subida de archivos en memoria
            upload.single("job-file")(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return response.status(500).json({ error: "Error uploading file" });
                }
                const project_id = request.get("project-id");
                const tokenWithBearer = request.headers.authorization;
                const file = request.file;
                if (!file) {
                    return response.status(400).json({ error: "No se subió archivo" });
                }
                try {
                    const serviceResponse = yield job_service_1.jobService.registerJobMasive(file, +project_id, tokenWithBearer);
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
            const result = yield job_service_1.jobService.createJob(data, project_id);
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
            const job_id = Number(request.params.id);
            const project_id = request.get("project-id");
            const result = yield job_service_1.jobService.updateJob(data, job_id, +project_id);
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
            const job_id = Number(request.params.id);
            const result = yield job_service_1.jobService.updateStatusJob(job_id);
            response.status(result.statusCode).json(result);
        });
    }
    findById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const job_id = Number(request.params.id);
            const result = yield job_service_1.jobService.findById(job_id);
            response.status(result.statusCode).json(result);
        });
    }
    allJobs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const search = request.query.search;
            const fecha_inicio = request.query.fecha_inicio;
            const fecha_finalizacion = request.query.fecha_finalizacion;
            const train = request.query.tren;
            const project_id = request.get("project-id");
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    search: search,
                    fecha_inicio: fecha_inicio,
                    fecha_finalizacion: fecha_finalizacion,
                    nameTrain: train,
                },
            };
            const result = yield job_service_1.jobService.findAll(paginationOptions, +project_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.jobController = new JobController();

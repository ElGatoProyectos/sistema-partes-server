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
const http_response_1 = require("@/common/http.response");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
class JobController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const tokenWithBearer = request.headers.authorization;
            if (tokenWithBearer) {
                const result = yield job_service_1.jobService.createJob(data);
                if (!result.success) {
                    response.status(result.statusCode).json(result);
                }
                else {
                    response.status(result.statusCode).json(result);
                }
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion al crear la unidad");
                response.status(result.statusCode).json(result);
            }
        });
    }
}
exports.jobController = new JobController();

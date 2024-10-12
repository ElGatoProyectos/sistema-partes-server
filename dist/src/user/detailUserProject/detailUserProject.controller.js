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
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailUserProjectController = void 0;
const detailUserProject_service_1 = require("./detailUserProject.service");
class DetailUserProjectController {
    allUsersByProject(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const name = request.query.name;
            const project_id = request.get("project-id");
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    name,
                },
            };
            const result = yield detailUserProject_service_1.detailUserProjectService.findAll(paginationOptions, project_id);
            response.status(result.statusCode).json(result);
        });
    }
    allUsersByProjectUnassigned(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const name = request.query.name;
            const project_id = request.get("project-id");
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    name,
                },
            };
            const result = yield detailUserProject_service_1.detailUserProjectService.findAllUnassigned(paginationOptions, project_id);
            response.status(result.statusCode).json(result);
        });
    }
    deleteUserFromProject(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const project_id = request.get("project-id");
            const user_id = Number(request.params.id);
            const result = yield detailUserProject_service_1.detailUserProjectService.deleteUserFromProject(user_id, +project_id);
            if (!result.success) {
                response.status(result.statusCode).json(result);
            }
            else {
                response.status(result.statusCode).json(result);
            }
        });
    }
}
exports.detailUserProjectController = new DetailUserProjectController();

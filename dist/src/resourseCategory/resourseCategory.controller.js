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
exports.resourseCategoryController = void 0;
const resourseCategory_service_1 = require("./resourseCategory.service");
class ResourceCategoryController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.body;
            const project_id = request.get("project-id");
            const result = yield resourseCategory_service_1.resourseCategoryService.createResourseCategory(data, +project_id);
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
            const project_id = request.get("project-id");
            const idResourseCategory = Number(request.params.id);
            const result = yield resourseCategory_service_1.resourseCategoryService.updateResourseCategory(data, idResourseCategory, +project_id);
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
            const idResourseCategory = Number(request.params.id);
            const result = yield resourseCategory_service_1.resourseCategoryService.updateStatusProject(idResourseCategory);
            response.status(result.statusCode).json(result);
        });
    }
    findByIdResourseCategory(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const idResourseCategory = Number(request.params.id);
            const result = yield resourseCategory_service_1.resourseCategoryService.findById(idResourseCategory);
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
            const result = yield resourseCategory_service_1.resourseCategoryService.findByName(name, paginationOptions);
            response.status(result.statusCode).json(result);
        });
    }
    allResoursesCategories(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const project_id = request.get("project-id");
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                },
            };
            const result = yield resourseCategory_service_1.resourseCategoryService.findAll(paginationOptions, +project_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.resourseCategoryController = new ResourceCategoryController();

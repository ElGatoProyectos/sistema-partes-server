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
exports.detailUserCompanyController = void 0;
const detailuserservice_service_1 = require("./detailuserservice.service");
class DetailUserCompanyController {
    allUsersByCompanyUnassigned(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const name = request.query.name;
            const company_id = request.get("company-id");
            let paginationOptions = {
                queryParams: {
                    page: page,
                    limit: limit,
                    name,
                },
            };
            const result = yield detailuserservice_service_1.detailUserCompanyService.findAllUnassigned(paginationOptions, company_id);
            response.status(result.statusCode).json(result);
        });
    }
}
exports.detailUserCompanyController = new DetailUserCompanyController();

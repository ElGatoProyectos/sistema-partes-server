import express from "@/config/express.config";
import {
  I_CreateCompanyBody,
  I_UpdateCompanyBody,
} from "./models/company.interface";
import { companyService } from "./company.service";
import { T_FindAll } from "@/common/models/pagination.types";

class CompanyController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateCompanyBody;
    const result = await companyService.createCompany(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateCompanyBody;
    const idCompany = Number(request.params.id);
    const result = await companyService.updateCompany(data, idCompany);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const idCompany = Number(request.params.id);
    const result = await companyService.updateStatusCompany(idCompany);
    response.status(result.statusCode).json(result);
  }

  async findByIdCompany(request: express.Request, response: express.Response) {
    const idCompany = Number(request.params.id);
    const result = await companyService.findById(idCompany);
    response.status(result.statusCode).json(result);
  }

  async findByName(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const name = request.query.name as string;
    const result = await companyService.searchByName(name, paginationOptions);
    response.status(result.statusCode).json(result);
  }

  async allCompanies(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await companyService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const companyController = new CompanyController();

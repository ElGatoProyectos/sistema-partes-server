import express from "@/config/express.config";
import {
  I_BankBody,
  I_CreateBankWorkforceBody,
} from "./models/bankWorkforce.interface";
import { bankWorkforceService } from "./bankWorkforce.service";
import { T_FindAllBank } from "./models/bankWorkforce.types";

class BankWorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_BankBody;
    const project_id = request.get("project-id") as string;
    const bankFormat: I_CreateBankWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await bankWorkforceService.createBankWorkforce(bankFormat);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_BankBody;
    const bank_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const originFormat: I_CreateBankWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await bankWorkforceService.updateBankWorkforce(
      bank_id,
      originFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const origiin_id = Number(request.params.id);
    const result = await bankWorkforceService.updateStatusBankWorkforce(
      origiin_id
    );
    response.status(result.statusCode).json(result);
  }

  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const search = request.query.search as string;
    let paginationOptions: T_FindAllBank = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await bankWorkforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
  async findByIdOrigin(request: express.Request, response: express.Response) {
    const bank_id = Number(request.params.id);
    const result = await bankWorkforceService.findById(bank_id);
    response.status(result.statusCode).json(result);
  }
}

export const bankWorkforceController = new BankWorkforceController();

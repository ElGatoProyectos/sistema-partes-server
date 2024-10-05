import express from "@/config/express.config";
import { T_FindAllDetailUserCompany } from "./models/detailsUserCompany.types";
import { detailUserCompanyService } from "./detailuserservice.service";

class DetailUserCompanyController {
  async allUsersByCompanyUnassigned(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const name = request.query.name as string;
    const company_id = request.get("company-id") as string;
    let paginationOptions: T_FindAllDetailUserCompany = {
      queryParams: {
        page: page,
        limit: limit,
        name,
      },
    };
    const result = await detailUserCompanyService.findAllUnassigned(
      paginationOptions,
      company_id
    );

    response.status(result.statusCode).json(result);
  }
}

export const detailUserCompanyController = new DetailUserCompanyController();

import { T_FindAllDetailUserCompany } from "./models/detailsUserCompany.types";

export abstract class CompanyRepository {
  createCompany(idUser: number, idCompany: number): void {}

  findByIdCompany(company_id: number): void {}

  findAllByIdCompanyWithOutPagination(company_id: number): void {}

  findByIdUser(user_id: number): void {}

  getAllUsersOfProjectUnassigned(
    skip: number,
    data: T_FindAllDetailUserCompany,
    project_id: number
  ): void {}

  countUsersForCompany(company_id: number): void {}
}

import {
  I_CreateCompanyBD,
  I_UpdateCompanyBody,
} from "./models/company.interface";

export abstract class CompanyRepository {
  findAll(skip: number, limit: number): void {}

  findById(idCompany: number): void {}

  existsName(name: string): void {}

  createCompany(data: I_CreateCompanyBD): void {}

  updateCompany(data: I_UpdateCompanyBody, idUser: number): void {}

  updateStatusCompany(idCompany: number): void {}

  searchNameCompany(name: string, skip: number, limit: number): void {}
}

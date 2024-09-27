export abstract class CompanyRepository {
  createCompany(idUser: number, idCompany: number): void {}

  findByIdCompany(company_id: number): void {}
}

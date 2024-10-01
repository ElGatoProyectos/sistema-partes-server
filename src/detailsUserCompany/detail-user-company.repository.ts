export abstract class CompanyRepository {
  createCompany(idUser: number, idCompany: number): void {}

  findByIdCompany(company_id: number): void {}

  findByIdUser(user_id: number): void {}

  countUsersForCompany(company_id: number): void {}
}

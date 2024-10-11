import { httpResponse, T_HttpResponse } from "../common/http.response";
import { I_CreateBankWorkforceBD } from "./models/bankWorkforce.interface";
import { prismaBankWorkforceRepository } from "./prisma-bankWorkforce.repository";

class BankWorkforceValidation {
  async findById(bank_id: number): Promise<T_HttpResponse> {
    try {
      const bank = await prismaBankWorkforceRepository.findById(bank_id);
      if (!bank)
        return httpResponse.NotFoundException(
          "No se encontró el banco solicitado"
        );
      return httpResponse.SuccessResponse("Banco encontrado con éxito", bank);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Banco",
        error
      );
    }
  }
  async findByName(name: string): Promise<T_HttpResponse> {
    try {
      const bank = await prismaBankWorkforceRepository.findByName(name);
      if (!bank)
        return httpResponse.NotFoundException(
          "No se encontró el Banco con el nombre que desea buscar"
        );
      return httpResponse.SuccessResponse("Banco encontrado con éxito", bank);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Banco",
        error
      );
    }
  }
  async createBank(data: I_CreateBankWorkforceBD): Promise<T_HttpResponse> {
    try {
      const bank = await prismaBankWorkforceRepository.createBankWorkforce(
        data
      );
      if (!bank)
        return httpResponse.NotFoundException("No se pudo crear el Banco");
      return httpResponse.SuccessResponse(
        "Se pudo crear el Banco con éxito",
        bank
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Banco",
        error
      );
    }
  }
}

export const bankWorkforceValidation = new BankWorkforceValidation();

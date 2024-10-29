import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaBankWorkforceRepository } from "./prisma-bankWorkforce.repository";
import { I_CreateBankWorkforceBody } from "./models/bankWorkforce.interface";
import { bankWorkforceValidation } from "./bankWorkforce.validation";
import { projectValidation } from "@/project/project.validation";
import prisma from "@/config/prisma.config";
import { Banco } from "@prisma/client";
import { workforceValidation } from "@/workforce/workforce.validation";
import { T_FindAllBank } from "./models/bankWorkforce.types";

class BankWorkforceService {
  async createBankWorkforce(
    data: I_CreateBankWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const resultOrigin = await bankWorkforceValidation.findByName(
        data.nombre,
        data.proyecto_id
      );
      if (resultOrigin.success) {
        return httpResponse.BadRequestException(
          "El nombre ingresado del Banco ya existe en la base de datos"
        );
      }
      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Banco con el id del Proyecto proporcionado"
        );
      }

      const responseOrigin =
        await prismaBankWorkforceRepository.createBankWorkforce(data);
      return httpResponse.CreatedResponse(
        "Banco creado correctamente",
        responseOrigin
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Banco",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateBankWorkforce(
    bank_id: number,
    data: I_CreateBankWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const bankResponse = await bankWorkforceValidation.findById(bank_id);
      if (!bankResponse.success) {
        return bankResponse;
      }
      const bank = bankResponse.payload as Banco;
      if (bank.nombre != data.nombre) {
        const resultType = await bankWorkforceValidation.findByName(
          data.nombre,
          data.proyecto_id
        );
        if (resultType.success) {
          return httpResponse.BadRequestException(
            "El Banco ingresado ya existe en la base de datos"
          );
        }
      }

      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Banco con el id del Proyecto proporcionado"
        );
      }

      const responseBank =
        await prismaBankWorkforceRepository.updateBankWorkforce(bank_id, data);
      return httpResponse.SuccessResponse(
        "Banco actualizado correctamente",
        responseBank
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar el Banco",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusBankWorkforce(bank_id: number): Promise<T_HttpResponse> {
    try {
      const resultBank = await bankWorkforceValidation.findById(bank_id);
      if (!resultBank.success) {
        return resultBank;
      }
      const resultIdWorkforce = await workforceValidation.findByIdBank(bank_id);
      if (resultIdWorkforce.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar el Banco porque ya tiene una relación con una Mano de Obra"
        );
      }
      const responseBank =
        await prismaBankWorkforceRepository.updateStatusBankWorkforce(bank_id);
      return httpResponse.CreatedResponse(
        "Banco eliminado correctamente",
        responseBank
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el Banco",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(bank_id: number): Promise<T_HttpResponse> {
    try {
      const bankResponse = await prismaBankWorkforceRepository.findById(
        bank_id
      );
      if (!bankResponse) {
        return httpResponse.NotFoundException(
          "El id del Banco no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse("Banco encontrada", bankResponse);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Banco",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAll(data: T_FindAllBank, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaBankWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { banks, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: banks,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Bancos",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Bancos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [
        { nombre: "BAN BINF", proyecto_id: project_id },
        { nombre: "BANCO NACION", proyecto_id: project_id },
        { nombre: "BBVA", proyecto_id: project_id },
        { nombre: "BCP", proyecto_id: project_id },
        { nombre: "EFECTIVO", proyecto_id: project_id },
        { nombre: "INTERBANK", proyecto_id: project_id },
        { nombre: "OTROS", proyecto_id: project_id },
        { nombre: "SCOTIABANK", proyecto_id: project_id }
      ];

      const bankWorkforce =
        await prismaBankWorkforceRepository.createBankWorkforceMasive(data);

      if (bankWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear los Bancos de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva de los Bancos de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva de los Bancos de la Mano de Obra",
        error
      );
    }
  }
}

export const bankWorkforceService = new BankWorkforceService();

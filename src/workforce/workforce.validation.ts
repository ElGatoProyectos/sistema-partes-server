import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { I_WorkforceExcel } from "./models/workforce.interface";
import { prismaWorkforceRepository } from "./prisma-workforce.repository";
import { typeWorkforceValidation } from "@/typeWorkforce/typeWorkforce.validation";
import {
  Banco,
  CategoriaObrero,
  E_Estado_MO_BD,
  EspecialidadObrero,
  ManoObra,
  OrigenObrero,
  TipoObrero,
  Unidad,
} from "@prisma/client";
import { originWorkforceValidation } from "@/originWorkforce/originWorkforce.validation";
import { categoryWorkforceValidation } from "@/categoryWorkforce/categoryWorkforce.validation";
import { specialtyWorkforceValidation } from "@/specialtyWorkforce/specialtyWorkfoce.validation";
import { unitValidation } from "@/unit/unit.validation";
import { bankWorkforceValidation } from "@/bankWorkforce/bankWorkforce.validation";
import prisma from "@/config/prisma.config";

class WorkforceValidation {
  async updateWorkforce(
    data: I_WorkforceExcel,
    project_id: number,
    workforce_id: number,
    user_id: number
  ): Promise<T_HttpResponse> {
    try {
      const typeResponse = await typeWorkforceValidation.findByName(
        data.TIPO.trim(),
        project_id
      );
      const type = typeResponse.payload as TipoObrero;
      const originResponse = await originWorkforceValidation.findByName(
        data.ORIGEN.trim(),
        project_id
      );

      const origin = originResponse.payload as OrigenObrero;
      const categoryResponse = await categoryWorkforceValidation.findByName(
        data.CATEGORIA.trim(),
        project_id
      );

      const category = categoryResponse.payload as CategoriaObrero;
      const specialtyResponse = await specialtyWorkforceValidation.findByName(
        data.ESPECIALIDAD.trim(),
        project_id
      );

      const specialty = specialtyResponse.payload as EspecialidadObrero;
      const unitResponse = await unitValidation.findBySymbol(
        data.UNIDAD.trim(),
        project_id
      );

      const unit = unitResponse.payload as Unidad;
      let bank: any;
      if (data.BANCO) {
        const bankResponse = await bankWorkforceValidation.findByName(
          data.BANCO.trim(),
          project_id
        );

        bank = bankResponse.payload as Banco;
      }

      const excelEpoch = new Date(1899, 11, 30);
      let inicioDate;
      if (data.INGRESO) {
        inicioDate = new Date(excelEpoch.getTime() + data.INGRESO * 86400000);
        inicioDate.setUTCHours(0, 0, 0, 0);
      }
      let endDate;
      if (data.CESE) {
        endDate = new Date(excelEpoch.getTime() + data.CESE * 86400000);
        endDate.setUTCHours(0, 0, 0, 0);
      }
      let dateOfBirth;
      if (data["FECHA DE NACIMIENTO"]) {
        dateOfBirth = new Date(
          excelEpoch.getTime() + data["FECHA DE NACIMIENTO"] * 86400000
        );
        dateOfBirth.setUTCHours(0, 0, 0, 0);
      }
      const workForceFormat = {
        documento_identidad: data.DNI.toString(),
        nombre_completo: data["APELLIDO Y NOMBRE COMPLETO"],
        tipo_obrero_id: type.id,
        origen_obrero_id: origin.id,
        categoria_obrero_id: category.id,
        especialidad_obrero_id: specialty.id,
        unidad_id: unit.id,
        banco_id: data.BANCO ? bank.id : null,
        fecha_inicio: data.INGRESO ? inicioDate : null,
        fecha_cese: data.CESE ? endDate : null,
        fecha_nacimiento: data["FECHA DE NACIMIENTO"] ? dateOfBirth : null,
        estado:
          data.ESTADO == E_Estado_MO_BD.ACTIVO
            ? E_Estado_MO_BD.ACTIVO
            : E_Estado_MO_BD.INACTIVO,
        escolaridad: data.ESCOLARIDAD ? String(data.ESCOLARIDAD) : null,
        cuenta: data.CUENTA,
        telefono: data.CELULAR ? String(data.CELULAR) : null,
        email_personal: data.CORREO,
        observacion: data.OBSERVACION,
        proyecto_id: project_id,
        usuario_id: user_id,
      };
      const workforceUpdate = await prismaWorkforceRepository.updateWorkforce(
        workForceFormat,
        workforce_id
      );
      return httpResponse.SuccessResponse(
        "Mano de Obra modificado correctamente",
        workforceUpdate
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Mano de Obra",
        error
      );
    }
  }
  async findByDni(dni: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findByDNI(
        dni,
        project_id
      );
      if (!workforce) {
        return httpResponse.NotFoundException(
          "Dni de la Mano de no fue encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "Dni de la Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el DNI de la Mano de Obra",
        error
      );
    }
  }

  async findByCode(code: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findByCode(
        code,
        project_id
      );
      if (workforce) {
        return httpResponse.NotFoundException(
          "Codigo de la Mano de Obra encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "Mano de Obra no encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar código de la Mano de Obra",
        error
      );
    }
  }
  async findByCodeValidation(
    code: string,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findByCode(
        code,
        project_id
      );
      if (!workforce) {
        return httpResponse.NotFoundException(
          "Codigo de la Mano de Obra no encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "Código de la Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar código de la Mano de Obra",
        error
      );
    }
  }
  async findById(workforce_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findById(workforce_id);
      if (!workforce) {
        return httpResponse.NotFoundException(
          "Id de la Mano de Obra no encontrado"
        );
      }
      return httpResponse.SuccessResponse("Mano de Obra encontrado", workforce);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Mano de Obra",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const train = await prismaWorkforceRepository.existsName(
        name,
        project_id
      );
      if (train) {
        return httpResponse.NotFoundException(
          "El nombre del empleado ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse("Tren encontrado", train);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Tren",
        error
      );
    }
  }

  async codeMoreHigh(project_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.codeMoreHigh(
        project_id
      );
      if (!workforce) {
        return httpResponse.SuccessResponse("No se encontraron resultados", 0);
      }
      return httpResponse.SuccessResponse(
        "Código de la Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el código de la Mano de Obra",
        error
      );
    }
  }
}

export const workforceValidation = new WorkforceValidation();
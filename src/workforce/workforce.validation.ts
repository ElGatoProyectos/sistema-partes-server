import { httpResponse, T_HttpResponse } from "../common/http.response";
import { I_WorkforceExcel } from "./models/workforce.interface";
import { prismaWorkforceRepository } from "./prisma-workforce.repository";
import { typeWorkforceValidation } from "../typeWorkforce/typeWorkforce.validation";
import {
  CategoriaObrero,
  E_Estado_MO_BD,
  EspecialidadObrero,
  ManoObra,
  OrigenObrero,
  TipoObrero,
  Unidad,
} from "@prisma/client";
import { originWorkforceValidation } from "../originWorkforce/originWorkforce.validation";
import { categoryWorkforceValidation } from "../categoryWorkforce/categoryWorkforce.validation";
import { specialtyWorkforceValidation } from "../specialtyWorkforce/specialtyWorkfoce.validation";
import { unitValidation } from "../unit/unit.validation";

class WorkforceValidation {
  async updateWorkforce(
    data: I_WorkforceExcel,
    project_id: number,
    workforce_id: number
  ): Promise<T_HttpResponse> {
    try {
      let type = null;
      if (data.TIPO) {
        const typeResponse = await typeWorkforceValidation.findByName(
          data.TIPO.trim(),
          project_id
        );
        type = typeResponse.payload as TipoObrero;
      }

      let origin = null;
      if (data.ORIGEN) {
        const originResponse = await originWorkforceValidation.findByName(
          data.ORIGEN.trim(),
          project_id
        );
        origin = originResponse.payload as OrigenObrero;
      }
      let category = null;
      if (data.CATEGORIA) {
        const categoryResponse = await categoryWorkforceValidation.findByName(
          data.CATEGORIA.trim(),
          project_id
        );

        category = categoryResponse.payload as CategoriaObrero;
      }

      let specialty = null;
      if (data.ESPECIALIDAD) {
        const specialtyResponse = await specialtyWorkforceValidation.findByName(
          data.ESPECIALIDAD.trim(),
          project_id
        );

        specialty = specialtyResponse.payload as EspecialidadObrero;
      }

      const unitResponse = await unitValidation.findBySymbol("HH", project_id);
      const unit = unitResponse.payload as Unidad;

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
      let estado;
      if (data.ESTADO.toUpperCase() == E_Estado_MO_BD.ACTIVO) {
        estado = E_Estado_MO_BD.ACTIVO;
      } else {
        estado = E_Estado_MO_BD.INACTIVO;
      }

      const workForceFormat = {
        documento_identidad: data.DNI.toString(),
        nombre_completo: data.NOMBRES,
        apellido_materno: data["APELLIDO MATERNO"],
        apellido_paterno: data["APELLIDO PATERNO"],
        tipo_obrero_id: type ? type.id : type,
        origen_obrero_id: origin ? origin.id : origin,
        contrasena: data.DNI.toString(),
        genero: data.GENERO,
        estado_civil: data["ESTADO CIVIL"],
        categoria_obrero_id: category ? category.id : category,
        especialidad_obrero_id: specialty ? specialty.id : specialty,
        unidad_id: unit.id,
        fecha_inicio: data.INGRESO ? inicioDate : null,
        fecha_cese: data.CESE ? endDate : null,
        estado: estado,
        telefono: data.CELULAR ? String(data.CELULAR) : null,
        email_personal: data.CORREO,
        proyecto_id: project_id,
        direccion: data.DIRECCION,
        lugar_nacimiento: data["LUGAR DE NACIMIENTO"],
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
  async findByIdType(type_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findByIdType(type_id);
      if (!workforce) {
        return httpResponse.NotFoundException(
          "El tipo que busca en Mano de Obra no fue encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "El tipo que busca en Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el tipo en Mano de Obra",
        error
      );
    }
  }
  async findByIdOrigin(origin_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findByIdOrigin(
        origin_id
      );
      if (!workforce) {
        return httpResponse.NotFoundException(
          "El Origen que busca en Mano de Obra no fue encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "El Origen que busca en Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Origen en Mano de Obra",
        error
      );
    }
  }
  async findByIdSpecialty(specialty_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findByIdSpecialty(
        specialty_id
      );
      if (!workforce) {
        return httpResponse.NotFoundException(
          "La Especialidad que busca en Mano de Obra no fue encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "La Especialidad que busca en Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Especialidad en Mano de Obra",
        error
      );
    }
  }
  async findByIdBank(bank_id: number): Promise<T_HttpResponse> {
    try {
      const workforce = await prismaWorkforceRepository.findByIdBank(bank_id);
      if (!workforce) {
        return httpResponse.NotFoundException(
          "El Banco que busca en Mano de Obra no fue encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "El Banco que busca en Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Banco en Mano de Obra",
        error
      );
    }
  }
  async findByIdCategoryBank(
    category_workforce_id: number
  ): Promise<T_HttpResponse> {
    try {
      const workforce =
        await prismaWorkforceRepository.findByIdCategoryWorkforce(
          category_workforce_id
        );
      if (!workforce) {
        return httpResponse.NotFoundException(
          "La Categoria que busca en Mano de Obra no fue encontrado",
          workforce
        );
      }
      return httpResponse.SuccessResponse(
        "La Categoria que busca en Mano de Obra encontrado",
        workforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria en Mano de Obra",
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
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Mano de Obra",
        error
      );
    }
  }
  async findAllWithoutPaginationForProject(
    project_id: number
  ): Promise<ManoObra[] | null> {
    const workforces =
      await prismaWorkforceRepository.findAllWithoutPaginationForProject(
        project_id
      );

    return workforces;
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

  async findManyId(ids: number[]): Promise<T_HttpResponse> {
    try {
      const workforces = await prismaWorkforceRepository.findManyId(ids);

      if (workforces.length < ids.length) {
        return httpResponse.NotFoundException(
          "Un Trabajador ingresado no existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "Los Trabajadores ingresados existen, pueden proceguir",
        workforces
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar los Trabajadores Ingresados",
        error
      );
    }
  }
}

export const workforceValidation = new WorkforceValidation();

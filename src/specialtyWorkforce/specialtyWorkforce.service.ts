import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaSpecialtyWorkforceRepository } from "./prisma-specialtyWorkforce.repository";
import { specialtyWorkforceValidation } from "./specialtyWorkfoce.validation";
import { projectValidation } from "@/project/project.validation";
import prisma from "@/config/prisma.config";
import { I_CreateSpecialtyWorkforceBody } from "./models/specialtyWorkforce.interface";
import { EspecialidadObrero } from "@prisma/client";
import { workforceValidation } from "@/workforce/workforce.validation";
import { T_FindAllSpecialty } from "./models/specialtyWorkforce.types";

class SpecialtyWorkforceService {
  async createOriginWorkforce(
    data: I_CreateSpecialtyWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const resultSpeciality = await specialtyWorkforceValidation.findByName(
        data.nombre,
        data.proyecto_id
      );
      if (resultSpeciality.success) {
        return httpResponse.BadRequestException(
          "El nombre ingresado de la Especialidad ya existe en la base de datos"
        );
      }
      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Especialidad con el id del Proyecto proporcionado"
        );
      }

      const responseSpeciality =
        await prismaSpecialtyWorkforceRepository.createSpecialtyWorkforce(data);
      return httpResponse.CreatedResponse(
        "La Especialidad de Mano de Obra fue creado correctamente",
        responseSpeciality
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Especialidad de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateOriginWorkforce(
    specialty_id: number,
    data: I_CreateSpecialtyWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const specialtyResponse = await specialtyWorkforceValidation.findById(
        specialty_id
      );
      if (!specialtyResponse.success) {
        return specialtyResponse;
      }
      const speciality = specialtyResponse.payload as EspecialidadObrero;
      if (speciality.nombre != data.nombre) {
        const resultType = await specialtyWorkforceValidation.findByName(
          data.nombre,
          data.proyecto_id
        );
        if (resultType.success) {
          return httpResponse.BadRequestException(
            "La Especiallidad ingresada ya existe en la base de datos"
          );
        }
      }

      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Especialidad con el id del Proyecto proporcionado"
        );
      }

      const responseSpecialty =
        await prismaSpecialtyWorkforceRepository.updateSpecialtyWorkforce(
          specialty_id,
          data
        );
      return httpResponse.SuccessResponse(
        "Especialidad actualizada correctamente",
        responseSpecialty
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar la Especialidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusOriginWorkforce(
    specialty_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultSpeciality = await specialtyWorkforceValidation.findById(
        specialty_id
      );
      if (!resultSpeciality.success) {
        return resultSpeciality;
      }
      const resultIdWorkforce = await workforceValidation.findByIdSpecialty(
        specialty_id
      );
      if (resultIdWorkforce.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar la Especialidad porque ya tiene una relación con una Mano de Obra"
        );
      }
      const responseSpecialty =
        await prismaSpecialtyWorkforceRepository.updateStatusSpecialtyWorkforce(
          specialty_id
        );
      return httpResponse.CreatedResponse(
        "Especialidad  eliminada correctamente",
        responseSpecialty
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la Especialidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAll(data: T_FindAllSpecialty, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaSpecialtyWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { specialities, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: specialities,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todas las Especialidades de Mano de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Especialidades de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(specialty_id: number): Promise<T_HttpResponse> {
    try {
      const specialtyResponse =
        await prismaSpecialtyWorkforceRepository.findById(specialty_id);
      if (!specialtyResponse) {
        return httpResponse.NotFoundException(
          "El id de la Especialidad no fue encontrada"
        );
      }
      return httpResponse.SuccessResponse(
        "Especialidad encontrada",
        specialtyResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Especialidad",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [
        { nombre: "Administrador", proyecto_id: project_id },
        { nombre: "Albañil", proyecto_id: project_id },
        { nombre: "Apoyo", proyecto_id: project_id },
        { nombre: "Apoyo-Ayudante", proyecto_id: project_id },
        { nombre: "Asistente Logística", proyecto_id: project_id },
        { nombre: "Asistente SSOMMA", proyecto_id: project_id },
        { nombre: "Carpintero", proyecto_id: project_id },
        { nombre: "Control de Costos", proyecto_id: project_id },
        { nombre: "Electricista", proyecto_id: project_id },
        { nombre: "Fierrero", proyecto_id: project_id },
        { nombre: "Gasfitero", proyecto_id: project_id },
        {
          nombre: "Ingeniera de Planificación y Control",
          proyecto_id: project_id,
        },
        {
          nombre: "Ingeniero Medio Ambiente",
          proyecto_id: project_id,
        },
        { nombre: "Ingeniero SSOMMA", proyecto_id: project_id },
        { nombre: "Operaciones", proyecto_id: project_id },
        { nombre: "Logística", proyecto_id: project_id },
        { nombre: "Maestro de obra", proyecto_id: project_id },
        { nombre: "Producción", proyecto_id: project_id },
        { nombre: "Representante Legal", proyecto_id: project_id },
        { nombre: "Residencia de Obra", proyecto_id: project_id },
        { nombre: "Topografo", proyecto_id: project_id },
        { nombre: "Vigilancia", proyecto_id: project_id },
      ];

      const specialtyWorkforce =
        await prismaSpecialtyWorkforceRepository.createSpecialtyWorkforceMasive(
          data
        );

      if (specialtyWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear las Especialidades de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva las Especialidades de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva las Especialidades de la Mano de Obra",
        error
      );
    }
  }
}

export const specialtyWorkforceService = new SpecialtyWorkforceService();

import { projectValidation } from "@/project/project.validation";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";
import { prismaDetailUserProjectRepository } from "./prismaUserProject.repository";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { userValidation } from "../user.validation";
import { rolValidation } from "@/rol/rol.validation";
import { Proyecto, Usuario, Rol, DetalleUsuarioProyecto } from "@prisma/client";
import { detailProjectValidation } from "./detailUserProject.validation";
import {
  I_CreateDetailAssignment,
  I_DeleteDetail,
} from "./models/detail.interface";
import { jwtService } from "@/auth/jwt.service";
import { prismaDetailProductionEngineerMasterBuilderRepository } from "../detailProductionEngineerMasterBuilder/prismaDetailProductionEngineerMasterBuilder.repository";
import { prismaDetailMasterBuilderForemanRepository } from "../detailMasterBuilderForeman/prismaDetailMasterBuilderForeman.repository";
import { prismaDetailForemanGroupLeaderRepository } from "../detailForemanGroupLeader/prisma-detailForemanGroupLeader.respository";
import { detailForemanGroupLeaderService } from "../detailForemanGroupLeader/detailForemanGroupLeader.service";
import { detailMasterBuilderForemanService } from "../detailMasterBuilderForeman/detailMasterBuilder.service";
import { detailProductionEngineerMasterBuilderService } from "../detailProductionEngineerMasterBuilder/detailProductionEngineerMasterBuilder.service";
import { I_Usuario } from "../models/user.interface";

class DetailUserProjectService {
  async createDetail(
    data: I_CreateDetailAssignment,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findById(data.user_id);
      if (!userResponse.success) {
        return httpResponse.BadRequestException(
          `El id ${data.user_id} del usuario proporcionado no existe en la base de datos`
        );
      }
      const users = await userValidation.findManyId(data.user2_id);
      if (!users.success) {
        return users;
      }
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "El id del Proyecto proporcionado no existe"
        );
      }

      if (data.assignment === "DETALLE-INGENIERO-PRODUCCION-MAESTRO-OBRA") {
        for (let index = 0; index < data.user2_id.length; index++) {
          await prismaDetailProductionEngineerMasterBuilderRepository.createDetailProductionEngineerMasterBuilder(
            data.user_id,
            data.user2_id[index],
            project_id
          );
        }
        return httpResponse.SuccessResponse(
          "Detalle Ingeniero Producción-Maestro Obra creado correctamente"
        );
      } else if (data.assignment === "DETALLE-MAESTRO-OBRA-CAPATAZ") {
        for (let index = 0; index < data.user2_id.length; index++) {
          await prismaDetailMasterBuilderForemanRepository.createDetailMasterBuilderForeman(
            data.user_id,
            data.user2_id[index],
            project_id
          );
        }
        return httpResponse.SuccessResponse(
          "Detalle Maestro Obra-Capataz creado correctamente"
        );
      } else if (data.assignment === "DETALLE-CAPATAZ-JEFE-GRUPO") {
        for (let index = 0; index < data.user2_id.length; index++) {
          await prismaDetailForemanGroupLeaderRepository.createDetailForemanGroupLeader(
            data.user_id,
            data.user2_id[index],
            project_id
          );
        }

        return httpResponse.SuccessResponse(
          "Detalle Capataz-Jefe Grupo creado correctamente"
        );
      } else {
        return httpResponse.BadRequestException(
          "El tipo de Asignamiento que proporciono no se tiene contemplado "
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Detalle de Asignamiento",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAll(
    data: T_FindAllDetailUserProject,
    project_id: string,
    token: string
  ) {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const user = userTokenResponse.payload as Usuario;
      const rolResponse = await rolValidation.findById(user.rol_id);
      const rol = rolResponse.payload as Rol;
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result =
        await prismaDetailUserProjectRepository.getAllUsersOfProject(
          skip,
          data,
          +project_id,
          user.id,
          rol.rol
        );

      const { userAll, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: userAll,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Usuarios del Proyecto",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Usuarios del Proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAllUnassigned(
    data: T_FindAllDetailUserProject,
    project_id: string
  ) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result =
        await prismaDetailUserProjectRepository.getAllUsersOfProjectUnassigned(
          skip,
          data,
          +project_id
        );

      const { userAll, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: userAll,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Usuarios del Proyecto sin asignar",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Usuarios del Proyecto sin asignar",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async deleteUserFromProject(
    user_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findById(user_id);
      if (!userResponse.success) {
        return userResponse;
      }
      const user = userResponse.payload as Usuario;
      const projectResponse = await projectValidation.findById(project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const project = projectResponse.payload as Proyecto;
      const rolResponse = await rolValidation.findByName("NO_ASIGNADO");
      const rol = rolResponse.payload as Rol;
      const changeRolResponse = await userValidation.updateRolUser(
        user.id,
        rol.id,
        project.id
      );
      if (!changeRolResponse.success) {
        return changeRolResponse;
      }
      const detailUserProjectResponse =
        await detailProjectValidation.findByIdUser(user.id, project.id);
      const detailUserProject =
        detailUserProjectResponse.payload as DetalleUsuarioProyecto;
      if (!userResponse.success) return userResponse;
      const result = await prismaDetailUserProjectRepository.deleteUserByDetail(
        detailUserProject.id
      );
      if (!result) {
        return httpResponse.BadRequestException(
          "Ocurrió un problema para borrar el Usuario del Proyecto"
        );
      }
      return httpResponse.SuccessResponse("Usuario eliminado correctamente");
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el usuario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async getDetailForRole(
    data: T_FindAllDetailUserProject,
    project_id: string,
    user_id: number
  ): Promise<T_HttpResponse> {
    try {
      const userResponse = await userValidation.findById(user_id);
      if (!userResponse.success) {
        return userResponse;
      }
      const user = userResponse.payload as I_Usuario;
      if (user.Rol?.rol === "INGENIERO_PRODUCCION") {
        const result =
          await detailProductionEngineerMasterBuilderService.findAll(
            data,
            project_id,
            user.id
          );
        return result;
      } else if (user.Rol?.rol === "MAESTRO_OBRA") {
        const result = await detailMasterBuilderForemanService.findAll(
          data,
          project_id,
          user.id
        );
        return result;
      } else if (user.Rol?.rol === "CAPATAZ") {
        const result = await detailForemanGroupLeaderService.findAll(
          data,
          project_id,
          user.id
        );
        return result;
      } else {
        return httpResponse.BadRequestException(
          "Error en la autenticación al buscar el Detalle del usuario "
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los detalles",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async deleteDetail(
    data: I_DeleteDetail,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      if (data.assignment === "DETALLE-CAPATAZ-JEFE-GRUPO") {
        const result = await detailForemanGroupLeaderService.deleteDetail(
          data.user_id,
          project_id
        );
        if (!result.success) {
          return result;
        } else {
          return result;
        }
      } else if (data.assignment === "DETALLE-MAESTRO-OBRA-CAPATAZ") {
        const result = await detailMasterBuilderForemanService.deleteDetail(
          data.user_id,
          project_id
        );
        if (!result.success) {
          return result;
        } else {
          return result;
        }
      } else if (
        data.assignment === "DETALLE-INGENIERO-PRODUCCION-MAESTRO-OBRA"
      ) {
        const result =
          await detailProductionEngineerMasterBuilderService.deleteDetail(
            data.user_id,
            project_id
          );
        if (!result.success) {
          return result;
        } else {
          return result;
        }
      } else {
        return httpResponse.BadRequestException(
          "El tipo de Asignamiento que proporciono no se tiene contemplado "
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar el Detalle",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const detailUserProjectService = new DetailUserProjectService();

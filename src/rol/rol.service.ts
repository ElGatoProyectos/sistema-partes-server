import { httpResponse, T_HttpResponse } from "../common/http.response";
import prisma from "../config/prisma.config";
import { prismaRolRepository } from "./prisma-rol.repository";
import { I_CreateRolBD } from "./models/rol.interfaces";
import { T_FindAllRol } from "./models/rol.types";

class RolService {
  async findAll(data: T_FindAllRol): Promise<T_HttpResponse> {
    try {
      
      if(data.queryParams.isOrder){
        if (data.queryParams.isOrder !== "true" && data.queryParams.isOrder !== "false"){
          return httpResponse.BadRequestException(
            "El orden ingresado no es válido",
          );
        }
      }
      const result = await prismaRolRepository.findAll(data);

      return httpResponse.SuccessResponse(
        "Éxito al traer todos los roles",
        result
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al traer los roles",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async createRol(data: I_CreateRolBD): Promise<T_HttpResponse> {
    try {
      const existsNameRol = await this.existsName(data.rol);
      if (!existsNameRol.success) {
        return httpResponse.NotFoundException(
          "El nombre ingresado ya existe en la base de datos"
        );
      }
      const result = await prismaRolRepository.createRol(data);
      return httpResponse.CreatedResponse("Rol creado correctamente", result);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al crear el rol",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(id: number): Promise<T_HttpResponse> {
    try {
      const rol = await prismaRolRepository.findById(id);
      if (!rol)
        return httpResponse.NotFoundException(
          "No se encontró el rol solicitado"
        );
      return httpResponse.SuccessResponse("Rol encontrado con éxito", rol);
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar rol",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async existsName(name: string) {
    try {
      const nameResponse = await prismaRolRepository.existsName(name);
      if (nameResponse) {
        return httpResponse.NotFoundException(
          "El nombre del rol ingresado ya existe en la base de datos"
        );
      }
      return httpResponse.SuccessResponse(
        "El nombre del rol no fue encontrado puede proseguir"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        " Error al buscar nombre del rol",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const rolService = new RolService();

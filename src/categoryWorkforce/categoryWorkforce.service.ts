import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaCategoryWorkforceRepository } from "./prisma-categoryWorkfoce.repository";
import { T_FindAllCategoryWorkforce } from "./models/categoryWorkforce.types";
import { projectValidation } from "@/project/project.validation";
import prisma from "@/config/prisma.config";
import { detailPriceHourWorkforceValidation } from "@/workforce/detailPriceHourWorkforce/detailPriceHourWorkforce.validation";
import { workforceValidation } from "@/workforce/workforce.validation";
import { I_CreateCategoryWorkforceBody } from "./models/categoryWorkforce.interface";
import { CategoriaObrero } from "@prisma/client";
import { categoryWorkforceValidation } from "./categoryWorkforce.validation";

class CategoryWorkforceService {
  async createCategoryWorkforce(
    data: I_CreateCategoryWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const resultCategory = await categoryWorkforceValidation.findByName(
        data.nombre,
        data.proyecto_id
      );
      if (resultCategory.success) {
        return httpResponse.BadRequestException(
          "El nombre ingresado de la Categoria de Mano de Obra ya existe en la base de datos"
        );
      }
      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Categoria de Mano de Obra con el id del Proyecto proporcionado"
        );
      }

      const responseCategory =
        await prismaCategoryWorkforceRepository.createCategoryWorkforce(data);
      return httpResponse.CreatedResponse(
        "La Categoria de Mano de Obra fue creado correctamente",
        responseCategory
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Categoria de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateCategoryWorkforce(
    category_workforce_id: number,
    data: I_CreateCategoryWorkforceBody
  ): Promise<T_HttpResponse> {
    try {
      const categoryResponse = await categoryWorkforceValidation.findById(
        category_workforce_id
      );
      if (!categoryResponse.success) {
        return categoryResponse;
      }
      const category = categoryResponse.payload as CategoriaObrero;
      if (category.nombre != data.nombre) {
        const resultType = await categoryWorkforceValidation.findByName(
          data.nombre,
          data.proyecto_id
        );
        if (resultType.success) {
          return httpResponse.BadRequestException(
            "La Categoria de la Mano de Obra ingresado ya existe en la base de datos"
          );
        }
      }

      const resultIdProject = await projectValidation.findById(
        data.proyecto_id
      );
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Categoria de la Mano de Obra con el id del Proyecto proporcionado"
        );
      }

      const responseBank =
        await prismaCategoryWorkforceRepository.updateCategoryWorkforce(
          category_workforce_id,
          data
        );
      return httpResponse.SuccessResponse(
        "La Categoria de la Mano de Obra fue actualizada correctamente",
        responseBank
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar la Categoria de la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateStatusCategoryWorkforce(
    category_workforce_id: number
  ): Promise<T_HttpResponse> {
    try {
      const categoryWorkforce = await categoryWorkforceValidation.findById(
        category_workforce_id
      );
      if (!categoryWorkforce.success) {
        return categoryWorkforce;
      }
      const resultDetail = await detailPriceHourWorkforceValidation.findById(
        category_workforce_id
      );
      if (resultDetail.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar esta Categoria de Mano de Obra porque ya pertenece a un Detalle Precio Hora Mano de Obra"
        );
      }
      const resultIdWorkforce = await workforceValidation.findByIdCategoryBank(
        category_workforce_id
      );
      if (resultIdWorkforce.success) {
        return httpResponse.BadRequestException(
          "No se puede eliminar la Categoria porque ya tiene una relación con una Mano de Obra"
        );
      }
      const responseCategory =
        await prismaCategoryWorkforceRepository.updateStatusCategoryWorkforce(
          category_workforce_id
        );
      return httpResponse.CreatedResponse(
        "Categoria de la Mano de Obra eliminada correctamente",
        responseCategory
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar la Categoria de la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(category_workforce_id: number): Promise<T_HttpResponse> {
    try {
      const categoryWorkforceResponse =
        await prismaCategoryWorkforceRepository.findById(category_workforce_id);
      if (!categoryWorkforceResponse) {
        return httpResponse.NotFoundException(
          "El id de la Categoria de Mano de Obra no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "La Categoria de la Mano de Obra fue encontrada",
        categoryWorkforceResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el la Categoria de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findAll(data: T_FindAllCategoryWorkforce, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaCategoryWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { categories, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: categories,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos las Categorias de Mano de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Categorias de Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [
        { nombre: "Oficial", proyecto_id: project_id },
        { nombre: "Operario", proyecto_id: project_id },
        { nombre: "Peon", proyecto_id: project_id },
        { nombre: "Administración", proyecto_id: project_id },
        { nombre: "Apoyo", proyecto_id: project_id },
        { nombre: "Asistente", proyecto_id: project_id },
        { nombre: "Ing. Residencia", proyecto_id: project_id },
        { nombre: "Ing. Producción", proyecto_id: project_id },
        { nombre: "Ing. de Costos", proyecto_id: project_id },
        { nombre: "Ing. Medio Ambiente", proyecto_id: project_id },
        { nombre: "Ing. SSOMMA", proyecto_id: project_id },
        { nombre: "Ing. Valorizaciones", proyecto_id: project_id },
        { nombre: "Logística", proyecto_id: project_id },
        { nombre: "Representante Legal", proyecto_id: project_id },
        { nombre: "Vigilancia", proyecto_id: project_id },
      ];

      const categoryWorkforce =
        await prismaCategoryWorkforceRepository.createCategoryWorkforceMasive(
          data
        );

      if (categoryWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear las Categorias de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva la Categoria de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva la Categoria de la Mano de Obra",
        error
      );
    }
  }
}

export const categoryWorkforceService = new CategoryWorkforceService();

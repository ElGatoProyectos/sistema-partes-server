import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { I_PriceHourWorkforce } from "./models/priceHourWorkforce.interface";
import { projectValidation } from "@/project/project.validation";
import prisma from "@/config/prisma.config";
import { converToDate } from "@/common/utils/date";
import { categoryWorkforceValidation } from "@/categoryWorkforce/categoryWorkforce.validation";
import { prismaDetailPriceHourWorkforceRepository } from "../detailPriceHourWorkforce/prisma-detailPriceHourWorkforce.repository";
import { prismaPriceHourWorkforceRepository } from "./prisma-priceHourWorkforce.repository";
import { T_FindAllPriceHourWorkforce } from "./models/priceHourWorkforce.types";

class PriceHourWorkforceService {
  async create(
    data: I_PriceHourWorkforce,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Tren con el id del Proyecto proporcionado"
        );
      }

      const fecha_inicio = converToDate(data.fecha_inicio);
      const fecha_fin = converToDate(data.fecha_fin);

      if (fecha_fin < fecha_inicio) {
        return httpResponse.BadRequestException(
          "La fecha de Finalización debe ser mayor o igual a la fecha de inicio"
        );
      }

      for (let i = 0; i < data.data.length; i++) {
        const responseCategoryWorkforce =
          await categoryWorkforceValidation.findById(
            +data.data[i].categoria_obrero_id
          );
        if (!responseCategoryWorkforce) {
          return responseCategoryWorkforce;
        }
      }

      const priceHourFormat = {
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        nombre: data.nombre,
        proyecto_id: project_id,
      };
      const priceHourCreated =
        await prismaPriceHourWorkforceRepository.createPriceHourWorkforce(
          priceHourFormat
        );

      const detallesPrecioHoraMO = data.data.map((item) => ({
        hora_normal: item.hora_normal,
        hora_extra_60: item.hora_extra_60,
        hora_extra_100: item.hora_extra_100,
        categoria_obrero_id: item.categoria_obrero_id,
        precio_hora_mo_id: priceHourCreated.id,
      }));

      const details =
        await prismaDetailPriceHourWorkforceRepository.createDetailPriceHourWorkforce(
          detallesPrecioHoraMO
        );

      if (details.count === 0) {
        return httpResponse.BadRequestException(
          "Hubo un problema para guardar los Detalle Precio Hora Mano de Obra"
        );
      }

      return httpResponse.CreatedResponse(
        "Precio Hora y su Detalle fue creado correctamente",
        priceHourCreated
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear Precio Hora y su Detalle",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(data: T_FindAllPriceHourWorkforce, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaPriceHourWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { priceHours, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: priceHours,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Precios y Hora de la Mano de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todos los Precios y Hora de la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(price_hour_id: number): Promise<T_HttpResponse> {
    try {
      const priceHourResponse =
        await prismaPriceHourWorkforceRepository.findById(price_hour_id);
      if (!priceHourResponse) {
        return httpResponse.NotFoundException(
          "El id de Precio-Hora no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Precio-Hora encontrado",
        priceHourResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el Precio-Hora",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const priceHourWorkforceService = new PriceHourWorkforceService();

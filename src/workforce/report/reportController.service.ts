import { httpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { projectValidation } from "../../project/project.validation";
import { weekValidation } from "../../week/week.validation";
import { T_FindAlReportlWorkforce } from "./models/reportWorkforce.types";


class WorkforceService {
  
  async findAll(data: T_FindAlReportlWorkforce, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      

      const weekOfTheYear = Array.from({ length: 52 }, (v, i) =>
        String(i + 1).padStart(2, "0")
      );

      if (data.queryParams.week) {
        const week = data.queryParams.week as string;
        const result = week.split(".");
        const dayWeek = result[1];
        if (!weekOfTheYear.includes(dayWeek)) {
          return httpResponse.BadRequestException(
            "No existe la semana que ha pasado"
          );
        }
      }

     
  
      // falta las condiciones como de token, etc....
      const moResponse = await prisma.manoObra.findMany({
        where: { proyecto_id: 1 },
      });
      // buscar por la fecha actual en la que se encuentre, o mejor dicho la ultima, con respecto al proyecto
  
      const allResponse = await Promise.all(
        moResponse.map(async (mo) => {
        //   const assistWeekResponse = await prisma.asistencia.findMany({
        //     where: {
        //       fecha: filters.fecha,
        //       mano_obra_id: mo.id,
        //     },
        //     include: {},
        //   });
  
        //   const finalResponse = await formatedToResponse(mo, assistWeekResponse);
  
        //   return finalResponse;
        })
      );
  
      return httpResponse.SuccessResponse("Reporte tareo", allResponse);
    //   const result = await prismaWorkforceRepository.findAll(
    //     skip,
    //     data,
    //     +project_id
    //   );

    //   const { workforces, total } = result;
    //   const pageCount = Math.ceil(total / data.queryParams.limit);
    //   const formData = {
    //     total,
    //     page: data.queryParams.page,
    //     // x ejemplo 20
    //     limit: data.queryParams.limit,
    //     //cantidad de paginas que hay
    //     pageCount,
    //     data: workforces,
    //   };
      return httpResponse.SuccessResponse(
        "Éxito al traer toda la Mano de Obra",
        // formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer toda la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }


}

export const workforceService = new WorkforceService();

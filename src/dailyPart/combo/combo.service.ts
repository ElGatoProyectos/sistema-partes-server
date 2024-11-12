import { httpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { projectValidation } from "../../project/project.validation";
import { workforceValidation } from "../../workforce/workforce.validation";
import { I_CreateComboBody } from "./models/combo.interface";
import { prismaComboRepository } from "./prisma-combo.respository";

class ComboService {
  async create(data: I_CreateComboBody, project_id: number) {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Combo con el id del Proyecto proporcionado"
        );
      }

      const workforcesResponse = await workforceValidation.findManyId(
        data.workforces_id
      );
      if (!workforcesResponse.success) {
        return workforcesResponse;
      }

      const comboFormat = {
        nombre: data.nombre,
        proyecto_id: project_id,
      };

      const combo = await prismaComboRepository.createCombo(comboFormat);

      if (combo) {
        await prismaComboRepository.createDetailCombo(
          data.workforces_id,
          combo.id
        );
      }

      return httpResponse.SuccessResponse(
        "Se creó con éxito el Combo con sus trabajadores"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Combo",
        error
      );
    }
  }

  async findAll(project_id: string) {
    try {
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaComboRepository.findAllWithOutPagination(
        +project_id
      );

      if (result) {
        let combos: any = [];
        if (result?.length > 0) {
          combos = result?.map((combo) => {
            return {
              id: combo.id,
              nombre: combo.nombre,
            };
          });
        }
        return httpResponse.SuccessResponse(
          "Éxito al traer todos los Combos del Proyecto",
          combos
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Combos del Proyecto",
        []
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Combos del Proyecto",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const comboService = new ComboService();

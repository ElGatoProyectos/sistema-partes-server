import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { I_RiskDailyPartBody } from "./models/riskDailyPart.interface";
import { projectValidation } from "../../project/project.validation";
import { prismaRiskDailyPartRepository } from "./prisma-riskDailyPart.repository";
import {
  E_Estado_Riesgo_BD,
  E_Riesgo_BD,
  ParteDiario,
  RiesgoParteDiario,
} from "@prisma/client";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { riskDailyPartReportValidation } from "./riskDailyPart.validation";
import { prismaDailyPartRepository } from "../prisma-dailyPart.repository";

class RiskDailyPartService {
  async updateRiskDailyPart(
    data: I_RiskDailyPartBody,
    daily_part_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return httpResponse.NotFoundException(
          "El Parte Diario no fue encontrado en el cración/actulización de la Restricción",
          dailyPartResponse.payload
        );
      }

      const dailyPart = dailyPartResponse.payload as ParteDiario;

      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Restricción del Parte Diario con el id del Proyecto proporcionado"
        );
      }

      let state: E_Estado_Riesgo_BD | null = null;
      if (data.estado != "") {
        const valuesState: { [key: string]: E_Estado_Riesgo_BD } = {
          PENDIENTE: E_Estado_Riesgo_BD.PENDIENTE,
          SOLUCIONADO: E_Estado_Riesgo_BD.SOLUCIONADO,
        };
        state = valuesState[data.estado];
      }

      let risk: E_Riesgo_BD | null = null;
      if (data.riesgo != "") {
        const valuesStateRisk: { [key: string]: E_Riesgo_BD } = {
          BAJO: E_Riesgo_BD.BAJO,
          MEDIO: E_Riesgo_BD.MEDIO,
          ALTO: E_Riesgo_BD.ALTO,
        };
        risk = valuesStateRisk[data.riesgo];
      }

      const riskDailyPartFormat = {
        descripcion: data.descripcion,
        estado: data.estado ? state : null,
        riesgo: data.riesgo ? risk : null,
        proyecto_id: project_id,
      };

      if (dailyPart.riesto_parte_diario_id != null) {
        const riskDailyPartResponse =
          await riskDailyPartReportValidation.findById(
            dailyPart.riesto_parte_diario_id
          );
        if (!riskDailyPartResponse.success) {
          return riskDailyPartResponse;
        }
        const rieskDailyPart =
          riskDailyPartResponse.payload as RiesgoParteDiario;

        const responseDailyPart =
          await prismaRiskDailyPartRepository.updateRiskDailyPart(
            riskDailyPartFormat,
            rieskDailyPart.id
          );
        return httpResponse.CreatedResponse(
          "La Restricción del Parte Diario fue modificado correctamente",
          responseDailyPart
        );
      }
      const responseDailyPart =
        await prismaRiskDailyPartRepository.createRiskDailyPart(
          riskDailyPartFormat
        );
      if (!responseDailyPart) {
        return httpResponse.BadRequestException(
          "No se pudo guardar bien la Restricción del Parte Diario"
        );
      }
      const dailyPartUpdate =
        await dailyPartReportValidation.updateDailyPartForRisk(
          dailyPart.id,
          responseDailyPart.id
        );
      if (!dailyPartUpdate.success) {
        return dailyPartUpdate;
      }
      return httpResponse.CreatedResponse(
        "La Restricción del Parte Diario fue creado correctamente",
        responseDailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear o modificar la Restricción del Parte Diario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPart = await prismaRiskDailyPartRepository.findById(
        daily_part_id
      );
      if (!dailyPart) {
        return httpResponse.NotFoundException(
          "Restricción Parte Diario no fue encontrado",
          dailyPart
        );
      }
      return httpResponse.SuccessResponse(
        "Restricción Parte Diario fue encontrado",
        dailyPart
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Restricción Parte Diario",
        error
      );
    }
  }

  async updateStatusRisk(risk_daily_part_id: number): Promise<T_HttpResponse> {
    try {
      const riskDailyPartResponse =
        await riskDailyPartReportValidation.findById(risk_daily_part_id);
      if (!riskDailyPartResponse.success) {
        return riskDailyPartResponse;
      }

      const dailyPartResponse = await dailyPartReportValidation.findByRiskId(
        risk_daily_part_id
      );
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const dailyPart = dailyPartResponse.payload as ParteDiario;
      await dailyPartReportValidation.updateDailyPartForRisk(
        dailyPart.id,
        null
      );

      const rieskDailyPart = riskDailyPartResponse.payload as RiesgoParteDiario;

      await prismaRiskDailyPartRepository.updateStateRiskDailyPart(
        rieskDailyPart.id
      );
      return httpResponse.SuccessResponse(
        "Restricción del Parte Diario eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar la Restricción del Parte Diario",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const riskDailyPartService = new RiskDailyPartService();

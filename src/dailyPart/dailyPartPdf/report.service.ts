import { ParteDiario, Usuario } from "@prisma/client";
import { TemplateHtmlInforme } from "../../../static/templates/template-html";
import { TemplateHtmlInformeParteDiario } from "../../../static/templates/template-informe-html";
import { jwtService } from "../../auth/jwt.service";
import { httpResponse } from "../../common/http.response";
import { DailyPartPdfService } from "./dailyPartPdf.service";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { I_DailyPart } from "../models/dailyPart.interface";

const pdfService = new DailyPartPdfService();

export class ReportService {
  async crearInforme(daily_part_id: number, tokenWithBearer: string) {
    try {
      // const userTokenResponse = await jwtService.getUserFromToken(
      //   tokenWithBearer
      // );
      // if (!userTokenResponse) return userTokenResponse;
      // const userResponse = userTokenResponse.payload as Usuario;
      const user_id = 1;
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const dailyPart = dailyPartResponse.payload as I_DailyPart;
      const dailyString = String(daily_part_id);
      pdfService.deleteImages(user_id, dailyString);

      await pdfService.createImage(user_id, dailyString, {});

      const template = TemplateHtmlInforme(user_id, dailyString, dailyPart);

      // await pdfService.createPdf(template, dailyString, user_id);

      return {
        success: true,
        message: "Error",
        payload: {
          id: user_id,
          user_id,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al crear informe",
      };
    }
  }

  async createInformeParteDiario() {
    try {
      // AQUI COLOCARIAS EL ID DEL USUARIO ACTUAL
      const id = "1";
      const user_id = 1;

      pdfService.deleteImages(user_id, id);

      const template = TemplateHtmlInformeParteDiario(user_id, id);

      await pdfService.createPdfPD(template, id, user_id);

      return {
        success: true,
        message: "Error",
        payload: {
          id,
          user_id,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al crear informe",
      };
    }
  }
}

export const reportService = new ReportService();

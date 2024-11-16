import { TemplateHtmlInforme } from "../../../static/templates/template-html";
import { TemplateHtmlInformeParteDiario } from "../../../static/templates/template-informe-html";
import { httpResponse } from "../../common/http.response";
import { DailyPartPdfService } from "./dailyPartPdf.service";

const pdfService = new DailyPartPdfService();

export class ReportService {
  async crearInforme(daily_part_id: number) {
    try {
      const user_id = 1;
      const dailyString = String(daily_part_id);
      pdfService.deleteImages(user_id, dailyString);

      await pdfService.createImage(user_id, dailyString, {});

      const template = TemplateHtmlInforme(user_id, dailyString);

      await pdfService.createPdf(template, dailyString, user_id);

      return httpResponse.SuccessResponse("Éxito al hacer el Reporte");
    } catch (error) {
      return httpResponse.BadRequestException(
        "Hubo un error en crear el Reporte"
      );
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

import { TemplateHtmlInforme } from "../../../static/templates/template-html";
import { TemplateHtmlInformeParteDiario } from "../../../static/templates/template-informe-html";
import { DailyPartPdfService } from "./dailyPartPdf.service";

const pdfService = new DailyPartPdfService();

export class ReportService {
  async crearInforme() {
    try {
      // AQUI COLOCARIAS EL ID DEL USUARIO ACTUAL
      const id = "1";
      const user_id = 1;

      pdfService.deleteImages(user_id, id);

      await pdfService.createImage(user_id, id, {});

      const template = TemplateHtmlInforme(user_id, id);

      await pdfService.createPdf(template, id, user_id);

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

import express from "@/config/express.config";
import multer from "multer";
import { workforceService } from "./workforce.service";
import { httpResponse } from "@/common/http.response";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class WorkforceController {
  workforceReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("workforce-file")(request, response, async (err: any) => {
      if (err) {
        console.log(err);
        return response.status(500).json({ error: "Error al leer el archivo" });
      }
      // const project_id = Number(request.params.project_id);

      const project_id = request.get("project-id") as string;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const tokenWithBearer = request.headers.authorization;
        if (!tokenWithBearer) {
          return httpResponse.BadRequestException(
            "No se encontró nada en Authorization "
          );
        }
        const serviceResponse = await workforceService.registerWorkforceMasive(
          file,
          +project_id,
          tokenWithBearer
        );

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };
}

export const workforceController = new WorkforceController();

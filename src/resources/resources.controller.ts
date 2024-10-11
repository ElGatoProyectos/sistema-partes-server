import express from "@/config/express.config";
import multer from "multer";
import { resourceService } from "./resources.service";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class ResourceController {
  resourceReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("resource-file")(request, response, async (err: any) => {
      if (err) {
        return response.status(500).json({ error: "Error al leer el archivo" });
      }
      // const project_id = Number(request.params.project_id);
      const project_id = request.get("project-id") as string;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const serviceResponse = await resourceService.registerResourceMasive(
          file,
          +project_id
        );

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };
}

export const resourceController = new ResourceController();

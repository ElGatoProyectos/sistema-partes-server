import { authService } from "@/auth/auth.service";
import express from "@/config/express.config";

import multer from "multer";
import { departureJobService } from "./departure.service";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class DepartureJobController {
  departureJobReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("departure-job-file")(request, response, async (err: any) => {
      if (err) {
        return response.status(500).json({ error: "Error uploading file" });
      }
      const project_id = request.get("project-id") as string;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const serviceResponse =
          await departureJobService.updateDepartureJobMasive(file, +project_id);

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };
}

export const departureJobController = new DepartureJobController();
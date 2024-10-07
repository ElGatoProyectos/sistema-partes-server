import { authService } from "@/auth/auth.service";
import express from "@/config/express.config";

import multer from "multer";
import { departureService } from "./departure.service";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class DepartureController {
  departureReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("departure-file")(request, response, async (err: any) => {
      if (err) {
        return response.status(500).json({ error: "Error uploading file" });
      }
      const token = request.get("Authorization") as string;
      const project_id = request.get("project-id") as string;
      const responseValidate = authService.verifyRolProjectAdminUser(token);
      if (!responseValidate?.success) {
        return response.status(401).json(responseValidate);
      } else {
        const file = request.file;
        if (!file) {
          return response.status(400).json({ error: "No se subió archivo" });
        }

        try {
          const serviceResponse =
            await departureService.registerDepartureMasive(
              file,
              +project_id,
              token
            );

          response.status(serviceResponse.statusCode).json(serviceResponse);
        } catch (error) {
          response.status(500).json(error);
        }
      }
    });
  };
}

export const departureController = new DepartureController();

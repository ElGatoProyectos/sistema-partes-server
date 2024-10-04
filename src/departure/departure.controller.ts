import express from "@/config/express.config";

import multer from "multer";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class DepartureController {
  // departureReadExcel = async (
  //   request: express.Request,
  //   response: express.Response
  // ) => {
  //   // Usando multer para manejar la subida de archivos en memoria
  //   upload.single("departure-file")(request, response, async (err: any) => {
  //     if (err) {
  //       return response.status(500).json({ error: "Error uploading file" });
  //     }
  //     const project_id = request.get("project-id") as string;
  //     const tokenWithBearer = request.headers.authorization as string;
  //     const file = request.file;
  //     if (!file) {
  //       return response.status(400).json({ error: "No se subió archivo" });
  //     }
  //     try {
  //       const serviceResponse = await jobService.registerJobMasive(
  //         file,
  //         +project_id,
  //         tokenWithBearer
  //       );
  //       response.status(serviceResponse.statusCode).json(serviceResponse);
  //     } catch (error) {
  //       response.status(500).json(error);
  //     }
  //   });
  // };
}

export const departureController = new DepartureController();

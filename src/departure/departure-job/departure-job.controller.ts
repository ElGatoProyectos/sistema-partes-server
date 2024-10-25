import { authService } from "@/auth/auth.service";
import express from "@/config/express.config";

import multer from "multer";
import { departureJobService } from "./departureJob.service";
import { T_FindAllDepartureJob } from "./models/departure-job.types";
import {
  I_DepartureJob,
  I_DepartureJobUpdate,
} from "./models/departureJob.interface";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class DepartureJobController {
  async createDetails(request: express.Request, response: express.Response) {
    const data = request.body as I_DepartureJob;
    const result = await departureJobService.createDetailJobDeparture(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async updateDetails(request: express.Request, response: express.Response) {
    const data = request.body as I_DepartureJobUpdate;
    const departure_job_id = Number(request.params.id);
    const result = await departureJobService.updateDepartureJob(
      departure_job_id,
      data
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const departure_job_id = Number(request.params.id);
    const result = await departureJobService.updateStatusDepartureJob(
      departure_job_id
    );
    response.status(result.statusCode).json(result);
  }
  async allDetailsDepartureJob(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;

    let paginationOptions: T_FindAllDepartureJob = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await departureJobService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
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

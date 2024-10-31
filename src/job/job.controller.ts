import express from "@/config/express.config";

import multer from "multer";
import { I_CreateJobBody, I_UpdateJobBody } from "./models/job.interface";
import { jobService } from "./job.service";
import { T_FindAllJob } from "./models/job.types";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class JobController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateJobBody;
    const project_id = request.get("project-id") as string;
    const result = await jobService.createJob(data, project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateJobBody;
    const job_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const result = await jobService.updateJob(data, job_id, +project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const job_id = Number(request.params.id);
    const result = await jobService.updateStatusJob(job_id);
    response.status(result.statusCode).json(result);
  }

  async findById(request: express.Request, response: express.Response) {
    const job_id = Number(request.params.id);
    const result = await jobService.findById(job_id);
    response.status(result.statusCode).json(result);
  }

  async allJobs(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const fecha_inicio = request.query.fecha_inicio as string;
    const fecha_finalizacion = request.query.fecha_finalizacion as string;
    const train = request.query.nameTrain as string;
    const state = request.query.state as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllJob = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
        fecha_inicio: fecha_inicio,
        fecha_finalizacion: fecha_finalizacion,
        train: train,
        state: state,
      },
    };
    const result = await jobService.findAll(paginationOptions, +project_id);
    response.status(result.statusCode).json(result);
  }

  jobReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("job-file")(request, response, async (err: any) => {
      if (err) {
        return response.status(500).json({ error: "Error uploading file" });
      }
      const project_id = request.get("project-id") as string;
      const tokenWithBearer = request.headers.authorization as string;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const serviceResponse = await jobService.registerJobMasive(
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

export const jobController = new JobController();

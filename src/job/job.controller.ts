import express from "@/config/express.config";

import multer from "multer";
import { I_CreateJobBody } from "./models/job.interface";
import { jobService } from "./job.service";
import { httpResponse } from "@/common/http.response";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class JobController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateJobBody;
    const tokenWithBearer = request.headers.authorization;
    const project_id = request.get("project-id") as string;
    if (tokenWithBearer) {
      const result = await jobService.createJob(
        data,
        tokenWithBearer,
        project_id
      );
      if (!result.success) {
        response.status(result.statusCode).json(result);
      } else {
        response.status(result.statusCode).json(result);
      }
    } else {
      const result = httpResponse.UnauthorizedException(
        "Error en la autenticacion al crear la unidad"
      );
      response.status(result.statusCode).json(result);
    }
  }

  // async update(request: express.Request, response: express.Response) {
  //   const data = request.body as I_UpdateTrainBody;
  //   const train_id = Number(request.params.id);
  //   const project_id = Number(request.params.project_id);
  //   const result = await trainService.updateTrain(data, train_id, project_id);
  //   if (!result.success) {
  //     response.status(result.statusCode).json(result);
  //   } else {
  //     response.status(result.statusCode).json(result);
  //   }
  // }

  // async updateCuadrilla(request: express.Request, response: express.Response) {
  //   const train_id = Number(request.params.id);
  //   const data = request.body as I_Cuadrilla_Train;
  //   const result = await trainService.updateCuadrillaTrain(data, train_id);
  //   if (!result.success) {
  //     response.status(result.statusCode).json(result);
  //   } else {
  //     response.status(result.statusCode).json(result);
  //   }
  // }

  async updateStatus(request: express.Request, response: express.Response) {
    const job_id = Number(request.params.id);
    const result = await jobService.updateStatusJob(job_id);
    response.status(result.statusCode).json(result);
  }

  // async findByIdTrain(request: express.Request, response: express.Response) {
  //   const idTrain = Number(request.params.id);
  //   const result = await trainService.findById(idTrain);
  //   response.status(result.statusCode).json(result);
  // }

  // async findByName(request: express.Request, response: express.Response) {
  //   const page = parseInt(request.query.page as string) || 1;
  //   const limit = parseInt(request.query.limit as string) || 20;
  //   const project_id = Number(request.params.project_id);
  //   let paginationOptions: T_FindAll = {
  //     queryParams: {
  //       page: page,
  //       limit: limit,
  //     },
  //   };
  //   //si buscaba como request.body no me llegaba bien para luego buscar
  //   const name = request.query.name as string;
  //   const result = await trainService.findByName(
  //     name,
  //     paginationOptions,
  //     project_id
  //   );
  //   response.status(result.statusCode).json(result);
  // }

  // async allTrains(request: express.Request, response: express.Response) {
  //   const page = parseInt(request.query.page as string) || 1;
  //   const limit = parseInt(request.query.limit as string) || 20;
  //   const project_id = Number(request.params.project_id);
  //   let paginationOptions: T_FindAll = {
  //     queryParams: {
  //       page: page,
  //       limit: limit,
  //     },
  //   };
  //   const result = await trainService.findAll(paginationOptions, project_id);
  //   response.status(result.statusCode).json(result);
  // }

  // trainReadExcel = async (
  //   request: express.Request,
  //   response: express.Response
  // ) => {
  //   // Usando multer para manejar la subida de archivos en memoria
  //   upload.single("train-file")(request, response, async (err: any) => {
  //     if (err) {
  //       return response.status(500).json({ error: "Error uploading file" });
  //     }
  //     const project_id = Number(request.params.project_id);
  //     const file = request.file;
  //     if (!file) {
  //       return response.status(400).json({ error: "No se subió archivo" });
  //     }

  //     try {
  //       const serviceResponse = await trainService.registerTrainMasive(
  //         file,
  //         +project_id
  //       );

  //       response.status(serviceResponse.statusCode).json(serviceResponse);
  //     } catch (error) {
  //       response.status(500).json(error);
  //     }
  //   });
  // };
}

export const jobController = new JobController();
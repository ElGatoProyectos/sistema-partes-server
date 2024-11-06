import { authService } from "../auth/auth.service";
import express from "../config/express.config";

import multer from "multer";
import { departureService } from "./departure.service";
import { T_FindAllDeparture } from "./models/departure.types";
import {
  I_CreateDepartureBody,
  I_UpdateDepartureBody,
} from "./models/departure.interface";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class DepartureController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateDepartureBody;
    const project_id = request.get("project-id") as string;
    const token = request.get("Authorization") as string;
    const result = await departureService.createDeparture(
      data,
      project_id,
      token
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateDepartureBody;
    const departure_id = Number(request.params.id);
    const token = request.get("Authorization") as string;
    const project_id = request.get("project-id") as string;
    const result = await departureService.updateDeparture(
      departure_id,
      data,
      project_id,
      token
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const departure_id = Number(request.params.id);
    const result = await departureService.updateStatusJob(departure_id);
    response.status(result.statusCode).json(result);
  }

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

  async findById(request: express.Request, response: express.Response) {
    const departure_id = Number(request.params.id);
    const result = await departureService.findById(departure_id);
    response.status(result.statusCode).json(result);
  }

  async allDepartures(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllDeparture = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await departureService.findAll(
      paginationOptions,
      +project_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const departureController = new DepartureController();

import express from "@/config/express.config";
import multer from "multer";
import { workforceService } from "./workforce.service";
import { httpResponse } from "@/common/http.response";
import { T_FindAllWorkforce } from "./models/workforce.types";
import { I_UpdateWorkforceBody } from "./models/workforce.interface";

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
        return response.status(500).json({ error: "Error al leer el archivo" });
      }
      // const project_id = Number(request.params.project_id);

      const project_id = request.get("project-id") as string;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const serviceResponse = await workforceService.registerWorkforceMasive(
          file,
          +project_id
        );

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };
  async allWorkforce(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const search = request.query.search as string;
    const state = request.query.state as string;
    const category = request.query.category as string;
    const origin = request.query.origin as string;
    let paginationOptions: T_FindAllWorkforce = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
        state: state,
        category: category,
        origin: origin,
      },
    };
    const result = await workforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateWorkforceBody;
    const workforce_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const result = await workforceService.updateWorkforce(
      data,
      workforce_id,
      +project_id
    );

    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const workforce_id = Number(request.params.id);
    const result = await workforceService.updateStatusWorkforce(workforce_id);
    response.status(result.statusCode).json(result);
  }
}

export const workforceController = new WorkforceController();

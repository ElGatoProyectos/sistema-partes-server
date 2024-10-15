import express from "@/config/express.config";
import multer from "multer";
import { resourceService } from "./resources.service";
import { T_FindAllResource } from "./models/resource.types";
import {
  I_CreateResourcesBody,
  I_UpdateResourcesBody,
} from "./models/resources.interface";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class ResourceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateResourcesBody;
    const project_id = request.get("project-id") as string;
    const result = await resourceService.createResource(data, +project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateResourcesBody;
    const resource_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const result = await resourceService.updateResource(
      data,
      +project_id,
      resource_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

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

  async allResources(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const category = request.query.category as string;
    let paginationOptions: T_FindAllResource = {
      queryParams: {
        page: page,
        limit: limit,
        category: category,
      },
    };
    const result = await resourceService.findAll(paginationOptions, project_id);
    response.status(result.statusCode).json(result);
  }

  async findById(request: express.Request, response: express.Response) {
    const resource_id = Number(request.params.id);
    const result = await resourceService.findById(resource_id);
    response.status(result.statusCode).json(result);
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const resource_id = Number(request.params.id);
    const result = await resourceService.updateStatusResource(resource_id);
    response.status(result.statusCode).json(result);
  }
}

export const resourceController = new ResourceController();

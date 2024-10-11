import { T_FindAll } from "@/common/models/pagination.types";
import express from "@/config/express.config";
import {
  I_CreateUnifiedIndexBody,
  I_ImportExcelRequestUnifiedIndex,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";
import { unifiedIndexService } from "./unifiedIndex.service";
import multer from "multer";
import { unifiedIndexExcelDto } from "./dto/unifiedIndexExcel.dto";
import { httpResponse } from "@/common/http.response";
import { T_FindAllUnifiedIndex } from "./models/unifiedIndex.types";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class UnifiedIndexController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUnifiedIndexBody;
    const project_id = request.get("project-id") as string;
    const tokenWithBearer = request.headers.authorization;
    if (tokenWithBearer) {
      const result = await unifiedIndexService.createUnifiedIndex(
        data,
        tokenWithBearer,
        +project_id
      );
      if (!result.success) {
        response.status(result.statusCode).json(result);
      } else {
        response.status(result.statusCode).json(result);
      }
    } else {
      const result = httpResponse.UnauthorizedException(
        "Error en la autenticacion al crear el indice unificado"
      );
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateUnifiedIndexBody;
    const idResourseCategory = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const tokenWithBearer = request.headers.authorization;
    if (tokenWithBearer) {
      const result = await unifiedIndexService.updateUnifiedIndex(
        data,
        idResourseCategory,
        tokenWithBearer,
        +project_id
      );
      if (!result.success) {
        response.status(result.statusCode).json(result);
      } else {
        response.status(result.statusCode).json(result);
      }
    } else {
      const result = httpResponse.UnauthorizedException(
        "Error en la autenticacion al modificar el indice unificado"
      );
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const idResourseCategory = Number(request.params.id);
    const result = await unifiedIndexService.updateStatusUnifiedIndex(
      idResourseCategory
    );
    response.status(result.statusCode).json(result);
  }

  async findByIdUnifiedIndex(
    request: express.Request,
    response: express.Response
  ) {
    const idResourseCategory = Number(request.params.id);
    const result = await unifiedIndexService.findById(idResourseCategory);
    response.status(result.statusCode).json(result);
  }

  async allUnifiedIndex(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllUnifiedIndex = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await unifiedIndexService.findAll(
      paginationOptions,
      +project_id
    );
    response.status(result.statusCode).json(result);
  }

  unifiedIndexReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("unified-index-file")(request, response, async (err: any) => {
      if (err) {
        return response.status(500).json({ error: "Error uploading file" });
      }
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const company_id = Number(request.params.id);
        const project_id = request.get("project-id") as string;
        const serviceResponse =
          await unifiedIndexService.registerUnifiedIndexMasive(
            file,
            +company_id,
            +project_id
          );

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };
}

export const unifiedIndexController = new UnifiedIndexController();

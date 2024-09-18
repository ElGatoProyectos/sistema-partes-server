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

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class UnifiedIndexController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUnifiedIndexBody;
    const result = await unifiedIndexService.createUnifiedIndex(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateUnifiedIndexBody;
    const idResourseCategory = Number(request.params.id);
    const result = await unifiedIndexService.updateUnifiedIndex(
      data,
      idResourseCategory
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
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

  async findByName(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const name = request.query.name as string;
    const result = await unifiedIndexService.findByName(
      name,
      paginationOptions
    );
    response.status(result.statusCode).json(result);
  }

  async allUnifiedIndex(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await unifiedIndexService.findAll(paginationOptions);
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
      const responseBody = request.body as I_ImportExcelRequestUnifiedIndex;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        unifiedIndexExcelDto.parse(request.body);
        const serviceResponse =
          await unifiedIndexService.registerUnifiedIndexMasive(
            file,
            +responseBody.idCompany
          );

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };
}

export const unifiedIndexController = new UnifiedIndexController();

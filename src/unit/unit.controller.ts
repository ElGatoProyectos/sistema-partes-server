import express from "@/config/express.config";
import {
  I_CreateUnitBody,
  I_ImportExcelRequestUnit,
  I_UpdateUnitBody,
} from "./models/unit.interface";
import { unitService } from "./unit.service";
import { T_FindAll } from "@/common/models/pagination.types";
import multer from "multer";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });
class UnitController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUnitBody;
    const result = await unitService.createUnit(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateUnitBody;
    const idUnit = Number(request.params.id);
    const result = await unitService.updateUnit(data, idUnit);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const idUnit = Number(request.params.id);
    const result = await unitService.updateStatusUnit(idUnit);
    response.status(result.statusCode).json(result);
  }

  async findByIdUnit(request: express.Request, response: express.Response) {
    const idUnit = Number(request.params.id);
    const result = await unitService.findById(idUnit);
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
    const result = await unitService.findByName(name, paginationOptions);
    response.status(result.statusCode).json(result);
  }

  async allResoursesCategories(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await unitService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }

  // unitReadExcel = async (
  //   request: express.Request,
  //   response: express.Response
  // ) => {
  //   // Usando multer para manejar la subida de archivos en memoria
  //   upload.single("unified-index-file")(request, response, async (err: any) => {
  //     if (err) {
  //       return response.status(500).json({ error: "Error uploading file" });
  //     }
  //     const responseBody = request.body as I_ImportExcelRequestUnit;
  //     const file = request.file;
  //     if (!file) {
  //       return response.status(400).json({ error: "No se subió archivo" });
  //     }

  //     try {
  //       unifiedIndexExcelDto.parse(request.body);
  //       const serviceResponse =
  //         await unifiedIndexService.registerUnifiedIndexMasive(
  //           file,
  //           +responseBody.idCompany
  //         );

  //       response.status(serviceResponse.statusCode).json(serviceResponse);
  //     } catch (error) {
  //       response.status(500).json(error);
  //     }
  //   });
  // };
}

export const unitController = new UnitController();

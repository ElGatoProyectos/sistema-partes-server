import express from "@/config/express.config";
import {
  I_CreateUnitBody,
  I_ImportExcelRequestUnit,
  I_UpdateUnitBody,
} from "./models/unit.interface";
import { unitService } from "./unit.service";
import { T_FindAll } from "@/common/models/pagination.types";
import multer from "multer";
import { httpResponse } from "@/common/http.response";
import { authService } from "@/auth/auth.service";
import { T_FindAllUnit } from "./models/unit.types";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });
class UnitController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUnitBody;
    const project_id = request.get("project-id") as string;
    const tokenWithBearer = request.headers.authorization;
    if (tokenWithBearer) {
      const result = await unitService.createUnit(
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
        "Error en la autenticacion al crear la unidad"
      );
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateUnitBody;
    const tokenWithBearer = request.headers.authorization;
    const project_id = request.get("project-id") as string;
    const unit_id = Number(request.params.id);
    if (tokenWithBearer) {
      const result = await unitService.updateUnit(
        data,
        unit_id,
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
        "Error en la autenticacion al modiciar la unidad"
      );
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

  async allResoursesCategories(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllUnit = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await unitService.findAll(paginationOptions, +project_id);
    response.status(result.statusCode).json(result);
  }

  unitReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("unit-file")(request, response, async (err: any) => {
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
          const serviceResponse = await unitService.registerUnitMasive(
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
}

export const unitController = new UnitController();

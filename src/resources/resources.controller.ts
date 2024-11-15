import express from "../config/express.config";
import multer from "multer";
import { resourceService } from "./resources.service";
import { T_FindAllResource } from "./models/resource.types";
import {
  I_CreateResourcesBody,
  I_UpdateResourcesBody,
} from "./models/resources.interface";
import * as ExcelJS from "exceljs";
import prisma from "../config/prisma.config";

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
    const search = request.query.search as string;
    let paginationOptions: T_FindAllResource = {
      queryParams: {
        page: page,
        limit: limit,
        category: category,
        search: search,
      },
    };
    const result = await resourceService.findAll(paginationOptions, project_id);
    response.status(result.statusCode).json(result);
  }
  async allResourcesForDailyPart(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const category = request.query.category as string;
    const search = request.query.search as string;
    const daily_part_id = Number(request.params.id);
    let paginationOptions: T_FindAllResource = {
      queryParams: {
        page: page,
        limit: limit,
        category: category,
        search: search,
      },
    };
    const result = await resourceService.findAllForDailyPart(
      paginationOptions,
      project_id,
      daily_part_id
    );
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

  async exportExcel(request: express.Request, response: express.Response) {
    const data = await prisma.recurso.findMany({
      include: {
        Unidad: true,
        CategoriaRecurso: true,
        IndiceUnificado: true,
      },
      orderBy: { codigo: "asc" },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TestExportXLS");
    worksheet.columns = [
      {
        header: "NOMBRE INDICE UNIFICADO",
        key: "nombreIndiceUnificado",
        width: 30,
      },
      { header: "CODIGO", key: "codigo", width: 20 },
      { header: "NOMBRE DEL RECURSO", key: "nombreRecurso", width: 50 },
      { header: "UNIDAD", key: "unidad", width: 20 },
      { header: "NOMBRE CATEGORIA RECURSO", key: "nombreCategoria", width: 40 },
      { header: "PRECIO", key: "precio", width: 20 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "244062" },
      };
      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },
      };
    });
    data.forEach((resource) => {
      const row = worksheet.addRow({
        nombreIndiceUnificado: resource.IndiceUnificado.nombre,
        codigo: resource.codigo,
        nombreRecurso: resource.nombre,
        unidad: resource.Unidad.simbolo,
        nombreCategoria: resource.CategoriaRecurso.nombre,
        precio: resource.precio,
      });
      row.getCell("nombreIndiceUnificado").numFmt = "@";
      row.getCell("codigo").numFmt = "@";
      row.getCell("nombreRecurso").numFmt = "@";
      row.getCell("unidad").numFmt = "@";
      row.getCell("nombreCategoria").numFmt = "@";
      row.getCell("precio").numFmt = "@";
    });
    const buffer = await workbook.xlsx.writeBuffer();
    response
      .header("Content-Disposition", "attachment; filename=recursos.xlsx")
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .end(buffer);
  }
}

export const resourceController = new ResourceController();

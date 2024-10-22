import express from "@/config/express.config";
import multer from "multer";
import { workforceService } from "./workforce.service";
import { T_FindAllWorkforce } from "./models/workforce.types";
import { I_UpdateWorkforceBody } from "./models/workforce.interface";
import * as ExcelJS from "exceljs";
import prisma from "@/config/prisma.config";
import { httpResponse } from "@/common/http.response";
const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class WorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateWorkforceBody;
    const project_id = request.get("project-id") as string;
    const result = await workforceService.createWorkforce(data, +project_id);

    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
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
    const speciality = request.query.speciality as string;
    const type = request.query.type as string;
    let paginationOptions: T_FindAllWorkforce = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
        state: state,
        category: category,
        origin: origin,
        specialty: speciality,
        type: type,
      },
    };
    const result = await workforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const workforce_id = Number(request.params.id);
    const result = await workforceService.updateStatusWorkforce(workforce_id);
    response.status(result.statusCode).json(result);
  }
  async exportExcel(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const data = await prisma.manoObra.findMany();
    console.log(data);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TestExportXLS");
    worksheet.columns = [
      { header: "NOMBRE", key: "name", width: 30 },
      { header: "APELLIDO MATERNO", key: "mother", width: 30 },
      { header: "APELLIDO PATERNO", key: "father", width: 30 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "93c5fd" },
      };
      cell.font = {
        bold: true,
      };
    });
    data.forEach((user) => {
      worksheet.addRow({
        name: user.nombre_completo,
        mother: user.apellido_materno,
        father: user.apellido_paterno,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    response
      .header("Content-Disposition", "attachment; filename=manoDeObra.xlsx")
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .end(buffer);
  }
}

export const workforceController = new WorkforceController();

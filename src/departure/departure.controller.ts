import { authService } from "../auth/auth.service";
import express from "../config/express.config";

import multer from "multer";
import { departureService } from "./departure.service";
import { T_FindAllDeparture } from "./models/departure.types";
import {
  I_CreateDepartureBody,
  I_UpdateDepartureBody,
} from "./models/departure.interface";
import * as ExcelJS from "exceljs";
import prisma from "../config/prisma.config";

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

  async exportExcel(request: express.Request, response: express.Response) {
    const data = await prisma.partida.findMany({
      include: {
        Unidad: true,
      },
      orderBy: { id_interno: "asc" },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TestExportXLS");
    worksheet.columns = [
      { header: "ID-PARTIDA", key: "id", width: 15 },
      { header: "ITEM", key: "item", width: 20 },
      { header: "PARTIDA", key: "partida", width: 80 },
      { header: "UNI", key: "uni", width: 20 },
      { header: "METRADO", key: "metrado", width: 20 },
      { header: "PRECIO", key: "precio", width: 20 },
      { header: "MANO DE OBRA UNITARIO", key: "manoObra", width: 35 },
      { header: "MATERIAL UNITARIO", key: "materialUnitario", width: 20 },
      { header: "EQUIPO UNITARIO", key: "equipoUnitario", width: 20 },
      {
        header: "SUBCONTRATA - VARIOS UNITARIO",
        key: "subcontrata",
        width: 35,
      },
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
    data.forEach((departure) => {
      const row = worksheet.addRow({
        id: departure.id_interno,
        item: departure.item,
        partida: departure.partida,
        uni: departure.Unidad?.simbolo,
        metrado: departure.metrado_inicial,
        precio: departure.precio,
        manoObra: departure.mano_de_obra_unitaria,
        materialUnitario: departure.material_unitario,
        equipoUnitario: departure.equipo_unitario,
        subcontrata: departure.subcontrata_varios,
      });
      row.getCell("id").numFmt = "@";
      row.getCell("item").numFmt = "@";
      row.getCell("metrado").numFmt = "@";
      row.getCell("precio").numFmt = "@";
      row.getCell("manoObra").numFmt = "@";
      row.getCell("materialUnitario").numFmt = "@";
      row.getCell("equipoUnitario").numFmt = "@";
      row.getCell("subcontrata").numFmt = "@";
    });
    const buffer = await workbook.xlsx.writeBuffer();
    response
      .header("Content-Disposition", "attachment; filename=partidas.xlsx")
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .end(buffer);
  }
}

export const departureController = new DepartureController();

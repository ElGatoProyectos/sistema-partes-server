import { trainDto } from "./dto/train.dto";
import express from "../config/express.config";
import { trainService } from "./train.service";
import {
  I_CreateTrainUnitBody,
  I_UpdateTrainBody,
} from "./models/production-unit.interface";
import multer from "multer";
import { T_FindAllTrain } from "./models/train.types";
import prisma from "../config/prisma.config";
import * as ExcelJS from "exceljs";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class TrainController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateTrainUnitBody;
    const project_id = request.get("project-id") as string;
    const result = await trainService.createTrain(data, +project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateTrainBody;
    const train_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const result = await trainService.updateTrain(data, train_id, project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const idTrain = Number(request.params.id);
    const result = await trainService.updateStatusTrain(idTrain);
    response.status(result.statusCode).json(result);
  }

  async findByIdTrain(request: express.Request, response: express.Response) {
    const idTrain = Number(request.params.id);
    const result = await trainService.findById(idTrain);
    response.status(result.statusCode).json(result);
  }

  async allTrains(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    // const project_id = Number(request.params.project_id);
    const search = request.query.search as string;
    let paginationOptions: T_FindAllTrain = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await trainService.findAll(paginationOptions, project_id);
    response.status(result.statusCode).json(result);
  }

  trainReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("train-file")(request, response, async (err: any) => {
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
        const serviceResponse = await trainService.registerTrainMasive(
          file,
          +project_id
        );

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };

  async exportExcel(request: express.Request, response: express.Response) {
    const data = await prisma.tren.findMany({
      orderBy: { codigo: "asc" },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TestExportXLS");
    worksheet.columns = [
      { header: "ID-TREN", key: "id", width: 15 },
      { header: "TREN", key: "tren", width: 40 },
      { header: "NOTA", key: "nota", width: 30 },
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
    data.forEach((train) => {
      const row = worksheet.addRow({
        id: train.codigo,
        tren: train.nombre,
        nota: train.nota,
      });
      row.getCell("id").numFmt = "@";
    });
    const buffer = await workbook.xlsx.writeBuffer();
    response
      .header("Content-Disposition", "attachment; filename=trenes.xlsx")
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .end(buffer);
  }
}

export const trainController = new TrainController();

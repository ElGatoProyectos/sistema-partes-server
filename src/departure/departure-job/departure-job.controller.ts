import express from "../../config/express.config";

import multer from "multer";
import { departureJobService } from "./departureJob.service";
import { T_FindAllDepartureJob } from "./models/departure-job.types";
import {
  I_DepartureJob,
  I_DepartureJobUpdate,
} from "./models/departureJob.interface";
import * as ExcelJS from "exceljs";
import prisma from "../../config/prisma.config";

const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class DepartureJobController {
  async createDetails(request: express.Request, response: express.Response) {
    const data = request.body as I_DepartureJob;
    const result = await departureJobService.createDetailJobDeparture(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async updateDetails(request: express.Request, response: express.Response) {
    const data = request.body as I_DepartureJobUpdate;
    const departure_job_id = Number(request.params.id);
    const result = await departureJobService.updateDepartureJob(
      departure_job_id,
      data
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const departure_job_id = Number(request.params.id);
    const result = await departureJobService.updateStatusDepartureJob(
      departure_job_id
    );
    response.status(result.statusCode).json(result);
  }
  async allDetailsDepartureJob(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllDepartureJob = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await departureJobService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
  async allForJob(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    const daily_part_id = Number(request.params.id);
    let paginationOptions: T_FindAllDepartureJob = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await departureJobService.findAllForJob(
      paginationOptions,
      project_id,
      daily_part_id
    );
    response.status(result.statusCode).json(result);
  }
  async allDetailsDepartureJobForDetail(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllDepartureJob = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await departureJobService.findAllForDetail(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
  departureJobReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("departure-job-file")(request, response, async (err: any) => {
      if (err) {
        return response.status(500).json({ error: "Error uploading file" });
      }
      const project_id = request.get("project-id") as string;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const serviceResponse =
          await departureJobService.updateDepartureJobMasive(file, +project_id);

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };

  async exportExcel(request: express.Request, response: express.Response) {
    const data = await prisma.detalleTrabajoPartida.findMany({
      include: {
        Trabajo: true,
        Partida: true,
      },
      orderBy: {
        Trabajo: {
          codigo: "asc",
        },
      },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TestExportXLS");
    worksheet.columns = [
      {
        header: "ID-TRABAJO",
        key: "idTrabajo",
        width: 20,
      },
      { header: "TRABAJOS", key: "trabajos", width: 40 },
      { header: "PARTIDA", key: "partida", width: 80 },
      { header: "METRADO", key: "metrado", width: 20 },
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
    data.forEach((detail) => {
      const row = worksheet.addRow({
        idTrabajo: detail.Trabajo.codigo,
        trabajos: detail.Trabajo.nombre,
        partida: detail.Partida.id_interno + "  " + detail.Partida.partida,
        metrado: detail.cantidad_total,
      });
      row.getCell("idTrabajo").numFmt = "@";
      row.getCell("trabajos").numFmt = "@";
      row.getCell("partida").numFmt = "@";
      row.getCell("metrado").numFmt = "@";
    });
    const buffer = await workbook.xlsx.writeBuffer();
    response
      .header(
        "Content-Disposition",
        "attachment; filename=trabajosPartidas.xlsx"
      )
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .end(buffer);
  }
}

export const departureJobController = new DepartureJobController();

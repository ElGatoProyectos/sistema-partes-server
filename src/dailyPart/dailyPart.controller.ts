import express from "../config/express.config";
import {
  I_DailyPartCreateBody,
  I_DailyPartPdf,
  I_DailyPartUpdateBody,
} from "./models/dailyPart.interface";
import { dailyPartService } from "./dailyPart.service";
import {
  T_FindAllDailyPart,
  T_FindAllDailyPartForJob,
} from "./models/dailyPart.types";
import { reportService } from "./dailyPartPdf/report.service";
import { httpResponse } from "../common/http.response";
import path from "path";
import appRootPath from "app-root-path";
import fs from "fs";

class DailyPartController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_DailyPartCreateBody;
    const project_id = request.get("project-id") as string;
    const result = await dailyPartService.createDailyPart(data, +project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_DailyPartUpdateBody;
    const project_id = request.get("project-id") as string;
    const daily_part_id = Number(request.params.id);
    const result = await dailyPartService.updateDailyPart(
      data,
      daily_part_id,
      +project_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async findById(request: express.Request, response: express.Response) {
    const id = Number(request.params.id);
    const result = await dailyPartService.findById(id);
    response.status(result.statusCode).json(result);
  }
  async getTotalWeek(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const result = await dailyPartService.getTotalForProject(+project_id);
    response.status(result.statusCode).json(result);
  }
  async findReport(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;

    const data = request.body as I_DailyPartPdf;
    const tokenWithBearer = request.headers.authorization;
    if (!tokenWithBearer) {
      return httpResponse.BadRequestException(
        "No se encontró el token para poder proseguir"
      );
    }
    const result: any = await reportService.crearInforme(
      tokenWithBearer,
      project_id,
      data
    );

    if (result.success && result.payload) {
      let filePath = "";
      filePath = path.join(
        appRootPath.path,
        "static",
        "reports",
        `informe-${result.payload.user_id}-${result.payload.user_id}.pdf`
      );

      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        response.setHeader("Content-Length", stat.size);
        response.setHeader("Content-Type", "application/pdf");
        response.setHeader(
          "Content-Disposition",
          `attachment; filename="informe-diario.pdf"`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
      } else {
        response
          .status(404)
          .json({ success: false, message: "Archivo no encontrado" });
      }
    } else {
      response.json(result);
    }
  }
  async createReportForId(request: express.Request, response: express.Response) {
    const daily_part_id = Number(request.params.id);
    const tokenWithBearer = request.headers.authorization;
    const project_id = request.get("project-id") as string;
    if (!tokenWithBearer) {
      return httpResponse.BadRequestException(
        "No se encontró el token para poder proseguir"
      );
    }
    const result:any = await reportService.createInformeParteDiario(daily_part_id,tokenWithBearer,project_id);

    if (result.success && result.payload) {
      
      let filePath = "";
      filePath = path.join(
        appRootPath.path,
        "static",
        "reports-pd",
        `informe-${result.payload.user_id}-${result.payload.daily_part_id}.pdf`
      );

      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        response.setHeader("Content-Length", stat.size);
        response.setHeader("Content-Type", "application/pdf");
        response.setHeader(
          "Content-Disposition",
          `attachment; filename="informe-parte-diario.pdf"`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
      } else {
        response
          .status(404)
          .json({ success: false, message: "Archivo no encontrado" });
      }
    } else {
      response.json(result);
    }
  }
  async findByInformation(
    request: express.Request,
    response: express.Response
  ) {
    const id = Number(request.params.id);
    const result = await dailyPartService.informationOfTheDailyPart(id);
    response.status(result.statusCode).json(result);
  }

  async allForJob(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const id = request.params.id;
    const date = request.query.date as string;
    let paginationOptions: T_FindAllDailyPartForJob = {
      queryParams: {
        page: page,
        limit: limit,
        date: date,
      },
    };
    const result = await dailyPartService.findAllForJob(paginationOptions, id);
    response.status(result.statusCode).json(result);
  }
  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const stage = request.query.stage as string;
    const train = request.query.train as string;
    const job = request.query.job as string;
    const start = request.query.start as string;
    const end = request.query.end as string;
    let paginationOptions: T_FindAllDailyPart = {
      queryParams: {
        page: page,
        limit: limit,
        stage: stage,
        train: train,
        job: job,
        start: start,
        end: end,
      },
    };
    const result = await dailyPartService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }

  async delete(request: express.Request, response: express.Response) {
    const daily_part_id = Number(request.params.id);
    const result = await dailyPartService.deleteAllFromDailyPart(daily_part_id);
    response.status(result.statusCode).json(result);
  }
}

export const dailyPartController = new DailyPartController();

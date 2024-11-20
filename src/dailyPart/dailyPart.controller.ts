import express from "../config/express.config";
import {
  I_DailyPartCreateBody,
  I_DailyPartUpdateBody,
} from "./models/dailyPart.interface";
import { dailyPartService } from "./dailyPart.service";
import {
  T_FindAllDailyPart,
  T_FindAllDailyPartForJob,
} from "./models/dailyPart.types";
import { reportService } from "./dailyPartPdf/report.service";
import { authService } from "../auth/auth.service";
import { httpResponse } from "../common/http.response";
import path from "path";
import appRootPath from "app-root-path";
import { Request, Response } from "express";
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
  async findReport(request: express.Request, response: express.Response) {
    const id = Number(request.params.id);
    const project_id = request.get("project-id") as string;

    // const result = await reportService.crearInforme(id, "hola");
    // response.status(result.statusCode).json(result);

    const result: any = await reportService.crearInforme(1, String(id));

    if (result.success && result.payload) {
      let filePath = "";
      filePath = path.join(
        appRootPath.path,
        "static",
        "reports",
        `informe-${result.payload.user_id}.pdf`
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

    // const tokenWithBearer = request.headers.authorization;
    // if (tokenWithBearer) {
    //   const result = await reportService.crearInforme(id, tokenWithBearer);
    //   response.status(result.statusCode).json(result);
    // } else {
    //   const result = httpResponse.UnauthorizedException(
    //     "Error en la autenticacion para hacer el reporte"
    //   );
    //   response.status(result.statusCode).json(result);
    // }
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
}

export const dailyPartController = new DailyPartController();

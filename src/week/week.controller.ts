import express from "@/config/express.config";
import { weekService } from "./week.service";

class WeekController {
  async findWeek(request: express.Request, response: express.Response) {
    const date = new Date();
    // const nuevaFecha = new Date(2024, 0, 5); // Año 2024, mes 0 (enero), día 5
    const result = await weekService.findByDate(date);
    response.status(result.statusCode).json(result);
  }
}

export const weekController = new WeekController();

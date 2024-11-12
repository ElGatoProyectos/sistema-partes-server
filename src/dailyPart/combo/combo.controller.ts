import express from "../../config/express.config";
import { comboService } from "./combo.service";
import { I_CreateComboBody } from "./models/combo.interface";

class ComboController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateComboBody;
    const project_id = request.get("project-id") as string;
    const result = await comboService.create(data, +project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async all(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const result = await comboService.findAll(project_id);
    response.status(result.statusCode).json(result);
  }
}

export const comboController = new ComboController();

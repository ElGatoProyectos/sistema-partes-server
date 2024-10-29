import express from "@/config/express.config";
import { detailWeekProjectService } from "./detailWeekProject.service";

class DetailWeekProjectController {
  async findAll(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const result = await detailWeekProjectService.findAll(project_id);
    response.status(result.statusCode).json(result);
  }
}

export const detailWeekProjectController = new DetailWeekProjectController();

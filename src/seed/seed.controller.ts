import express from "../config/express.config";
import { seedService } from "./seed.service";

class SeedController {
  async create(request: express.Request, response: express.Response) {
    const result = await seedService.create();
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
}
export const seedController = new SeedController();

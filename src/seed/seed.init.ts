import { seedController } from "./seed.controller";
import express from "../config/express.config";
const seedRouter = express.Router();
const prefix = "/seed";

seedRouter.post(`${prefix}`, seedController.create);

export default seedRouter;

import express from "../../config/express.config";
import { dailyPartPhotosController } from "./dailyPartController";

const dailyPartPhotosRouter = express.Router();
const prefix = "/daily-part/:id/photos";

dailyPartPhotosRouter.post(
  `${prefix}`,
  // dailyPartMiddleware.verifyHeadersFieldsIdProject,
  dailyPartPhotosController.create
);

export default dailyPartPhotosRouter;

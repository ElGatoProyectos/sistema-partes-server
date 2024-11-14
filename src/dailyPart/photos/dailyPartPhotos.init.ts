import express from "../../config/express.config";
import { photoMiddleware } from "./dailyPart.middlware";
import { dailyPartPhotosController } from "./dailyPartController";

const dailyPartPhotosRouter = express.Router();
const prefix = "/daily-part/:id/photos";

dailyPartPhotosRouter.put(`${prefix}`, dailyPartPhotosController.put);
dailyPartPhotosRouter.get(
  `${prefix}/:numberPhoto`,
  photoMiddleware.verifyHeadersFieldsId,
  photoMiddleware.verifyHeadersFieldsNumberPhoto,
  dailyPartPhotosController.findImage
);
dailyPartPhotosRouter.delete(
  `${prefix}/:number`,
  dailyPartPhotosController.deleteImage
);

export default dailyPartPhotosRouter;

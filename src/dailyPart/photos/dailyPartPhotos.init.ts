import express from "../../config/express.config";
import { photoMiddleware } from "./dailyPartPhotos.middlware";
import { dailyPartPhotosController } from "./dailyPartPhotos.controller";

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

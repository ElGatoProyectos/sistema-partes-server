import express from "@/config/express.config";
import { trainController } from "./train.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { trainMiddleware } from "./train.middleware";

const trainRouter = express.Router();
const prefix = "/train";

trainRouter.get(
  `${prefix}`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.allTrains
);

trainRouter.get(
  `${prefix}/search`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.findByName
);

trainRouter.get(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.findByIdTrain
);

trainRouter.put(
  `${prefix}/cuadrilla/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  trainMiddleware.verifyFieldsUpdateCuadrilla,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.updateCuadrilla
);

trainRouter.post(
  `${prefix}`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  trainMiddleware.verifyFields,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.create
);
trainRouter.post(
  `${prefix}/upload-excel`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.trainReadExcel
);

trainRouter.delete(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.updateStatus
);

trainRouter.put(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  trainMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  trainController.update
);

export default trainRouter;

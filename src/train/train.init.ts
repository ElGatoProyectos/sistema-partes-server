import express from "@/config/express.config";
import { trainController } from "./train.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { trainMiddleware } from "./train.middleware";

const trainRouter = express.Router();
const prefix = "/train";

trainRouter.get(
  `${prefix}`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.allTrains
);

trainRouter.get(
  `${prefix}/search`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.findByName
);

trainRouter.get(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.findByIdTrain
);

trainRouter.put(
  `${prefix}/cuadrilla/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  trainMiddleware.verifyFieldsUpdateCuadrilla,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.updateCuadrilla
);

trainRouter.post(
  `${prefix}`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  trainMiddleware.verifyFields,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.create
);
trainRouter.post(
  `${prefix}/upload-excel`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.trainReadExcel
);

trainRouter.delete(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.updateStatus
);

trainRouter.put(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  trainMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  trainController.update
);

export default trainRouter;

import express from "@/config/express.config";
import { trainController } from "./train.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { trainMiddleware } from "./train.middleware";

const trainRouter = express.Router();
const prefix = "/train";

trainRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.allTrains
);

trainRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.findByName
);

trainRouter.get(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.findByIdTrain
);

trainRouter.put(
  `${prefix}/cuadrilla/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  trainMiddleware.verifyFieldsUpdateCuadrilla,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.updateCuadrilla
);

trainRouter.post(
  `${prefix}/project/:project_id`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  trainMiddleware.verifyFields,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.create
);
trainRouter.post(
  `${prefix}/upload-excel/project/:project_id`,
  trainMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.trainReadExcel
);

trainRouter.delete(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.updateStatus
);

trainRouter.put(
  `${prefix}/:id/project/:project_id`,
  trainMiddleware.verifyHeadersFieldsId,
  trainMiddleware.verifyHeadersFieldsIdProject,
  trainMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.update
);

export default trainRouter;

import express from "@/config/express.config";
import { trainController } from "./train.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { trainMiddleware } from "./train.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";

const trainRouter = express.Router();
const prefix = "/train";

trainRouter.post(
  `${prefix}`,
  trainMiddleware.verifyFields,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.create
);
trainRouter.post(
  `${prefix}/upload-excel`,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.trainReadExcel
);

trainRouter.put(
  `${prefix}/cuadrilla`,
  trainMiddleware.verifyFieldsUpdateCuadrilla,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.updateCuadrilla
);

trainRouter.get(
  `${prefix}`,
  requestMiddleware.validatePagination,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.allTrains
);

trainRouter.get(
  `${prefix}/search`,
  requestMiddleware.validatePagination,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.findByName
);

trainRouter.get(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.findByIdTrain
);

trainRouter.put(
  `${prefix}/:id`,
  trainMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.update
);

trainRouter.delete(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  trainController.updateStatus
);

export default trainRouter;

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
  authRoleMiddleware.authViewProject,
  trainController.create
);

trainRouter.put(
  `${prefix}/cuadrilla`,
  trainMiddleware.verifyFieldsUpdateCuadrilla,
  authRoleMiddleware.authViewProject,
  trainController.updateCuadrilla
);

trainRouter.get(
  `${prefix}`,
  trainMiddleware.verifyHeadersFields,
  authRoleMiddleware.authViewProject,
  trainController.allTrains
);

trainRouter.get(
  `${prefix}/search`,
  requestMiddleware.validatePagination,
  authRoleMiddleware.authViewProject,
  trainController.findByName
);

trainRouter.get(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFields,
  authRoleMiddleware.authViewProject,
  trainController.findByIdTrain
);

trainRouter.put(
  `${prefix}/:id`,
  trainMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authViewProject,
  trainController.update
);

trainRouter.delete(
  `${prefix}/:id`,
  trainMiddleware.verifyHeadersFields,
  authRoleMiddleware.authViewProject,
  trainController.updateStatus
);

export default trainRouter;

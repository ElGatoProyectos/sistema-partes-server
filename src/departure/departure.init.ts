import express from "@/config/express.config";
import { departureMiddleware } from "./departure.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { departureController } from "./departure.controller";

const departureRouter = express.Router();

const prefix = "/departure";

departureRouter.post(
  `${prefix}`,
  departureMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  departureController.create
);

departureRouter.put(
  `${prefix}/:id`,
  departureMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminUser,
  departureController.update
);

departureRouter.post(
  `${prefix}/upload-excel`,
  departureMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  departureController.departureReadExcel
);

departureRouter.get(
  `${prefix}`,
  departureMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  departureController.allDepartures
);

departureRouter.get(
  `${prefix}/:id`,
  departureMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  departureController.findById
);

departureRouter.delete(
  `${prefix}/:id`,
  departureMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  departureController.updateStatus
);

export default departureRouter;

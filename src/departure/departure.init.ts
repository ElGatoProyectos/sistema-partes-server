import express from "../config/express.config";
import { departureMiddleware } from "./departure.middleware";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { departureController } from "./departure.controller";

const departureRouter = express.Router();

const prefix = "/departure";

departureRouter.post(
  `${prefix}`,
  departureMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureController.create
);

departureRouter.put(
  `${prefix}/:id`,
  departureMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureController.update
);

departureRouter.post(
  `${prefix}/upload-excel`,
  departureMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureController.departureReadExcel
);

departureRouter.get(
  `${prefix}`,
  departureMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  departureController.allDepartures
);

departureRouter.get(
  `${prefix}/:id`,
  departureMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureController.findById
);

departureRouter.delete(
  `${prefix}/:id`,
  departureMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureController.updateStatus
);

export default departureRouter;

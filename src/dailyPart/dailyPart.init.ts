import { dailyPartMiddleware } from "./dailyPart.middleware";

import express from "../config/express.config";
import { dailyPartController } from "./dailyPart.controller";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";

const dailyPartRouter = express.Router();
const prefix = "/daily-part";

dailyPartRouter.get(
  `${prefix}`,
  dailyPartMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartController.all
);
dailyPartRouter.get(
  `${prefix}/work/:id`,
  dailyPartMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartController.allForJob
);

dailyPartRouter.put(
  `${prefix}/:id`,
  dailyPartMiddleware.verifyHeadersFieldsId,
  dailyPartMiddleware.verifyHeadersFieldsIdProject,
  dailyPartMiddleware.verifyFieldsUpdate,
  //[message] fijarme que roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  dailyPartController.update
);

dailyPartRouter.get(
  `${prefix}/:id`,
  dailyPartMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  dailyPartController.findById
);

export default dailyPartRouter;

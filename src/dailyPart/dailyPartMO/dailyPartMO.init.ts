import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { dailyPartMOController } from "./dailyPartMO.controller";
import { dailyPartMOMiddleware } from "./dailyPartMO.middleware";

const dailyPartMORouter = express.Router();
const prefix = "/daily-part-mo";
const prefixWithDailyPart = "/daily-part/:id/daily-part-mo";

dailyPartMORouter.post(
  `${prefix}`,
  dailyPartMOMiddleware.verifyFields,
  dailyPartMOMiddleware.verifyHeadersFieldsIdProject,
  //[message] ver roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartMOController.create
);
dailyPartMORouter.put(
  `${prefixWithDailyPart}/:idMO`,
  dailyPartMOMiddleware.verifyFieldsUpdate,
  dailyPartMOMiddleware.verifyHeadersFieldsId,
  dailyPartMOMiddleware.verifyHeadersFieldsIdProject,
  //[message] ver roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartMOController.update
);

dailyPartMORouter.get(
  `${prefixWithDailyPart}`,
  dailyPartMOMiddleware.verifyHeadersFieldsId,
  dailyPartMOMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartMOController.all
);

dailyPartMORouter.get(
  `${prefix}/:id`,
  dailyPartMOMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartMOController.findById
);
dailyPartMORouter.delete(
  `${prefix}/:id`,
  dailyPartMOMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartMOController.delete
);

export default dailyPartMORouter;

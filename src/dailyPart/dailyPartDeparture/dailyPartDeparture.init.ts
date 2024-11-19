import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { dailyPartDepartureController } from "./dailyPartDeparture.controller";
import { dailyPartDepartureMiddleware } from "./dailyPartDeparture.middleware";

const dailyPartDepartureRouter = express.Router();
const prefix = "/daily-part-departure";
const prefixDetail = "/daily-part/departure";
const prefixWithDailyPartAndDetail = "/daily-part/:id/departure";

dailyPartDepartureRouter.get(
  `${prefixWithDailyPartAndDetail}`,
  dailyPartDepartureMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartDepartureController.allForJob
);

dailyPartDepartureRouter.get(
  `${prefixDetail}/:id`,
  dailyPartDepartureMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartDepartureController.findById
);

dailyPartDepartureRouter.put(
  `${prefix}/:idDeparture`,
  dailyPartDepartureMiddleware.verifyHeadersFieldsIdDeparture,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartDepartureController.update
);

export default dailyPartDepartureRouter;

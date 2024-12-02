import { dailyPartMiddleware } from "./dailyPart.middleware";

import express from "../config/express.config";
import { dailyPartController } from "./dailyPart.controller";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";

const dailyPartRouter = express.Router();
const prefix = "/daily-part";
const prefixWithReport = "/daily-part/report-production";
const prefixWithReportForId = "/daily-part/:id/report-production";

dailyPartRouter.post(
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
  dailyPartController.create
);
dailyPartRouter.post(
  `${prefixWithReport}`,
  dailyPartMiddleware.verifyFieldsPdf,
  dailyPartMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartController.findReport
);
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

dailyPartRouter.get(
  `${prefixWithReportForId}`,
  dailyPartMiddleware.verifyHeadersFieldsId,
  dailyPartMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartController.createReportForId
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
  `${prefix}/total-week`,
  dailyPartMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  dailyPartController.getTotalWeek
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
dailyPartRouter.get(
  `${prefix}/:id/information`,
  dailyPartMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  dailyPartController.findByInformation
);

dailyPartRouter.delete(
  `${prefix}/:id`,
  dailyPartMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  dailyPartController.delete
);

export default dailyPartRouter;

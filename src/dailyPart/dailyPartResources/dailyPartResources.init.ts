import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { dailyPartResourceController } from "./dailyPartResources.controller";
import { dailyPartResourceMiddleware } from "./dailyPartResources.middleware";

const dailyPartResourceRouter = express.Router();
const prefix = "/daily-part/:id/resource";
const prefixOfThisArchive = "/daily-part-resource";
const prefixOfThisArchiveWithDailyPart = "/daily-part/:id/daily-part-resource";

dailyPartResourceRouter.post(
  `${prefix}`,
  dailyPartResourceMiddleware.verifyHeadersFieldsId,
  dailyPartResourceMiddleware.verifyHeadersFieldsIdProject,
  dailyPartResourceMiddleware.verifyFields,
  //[message]ver roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartResourceController.create
);
dailyPartResourceRouter.put(
  `${prefixOfThisArchive}/:id`,
  dailyPartResourceMiddleware.verifyHeadersFieldsId,
  dailyPartResourceMiddleware.verifyHeadersFieldsIdProject,
  dailyPartResourceMiddleware.verifyFieldsUpdate,
  //[message]ver roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartResourceController.update
);
dailyPartResourceRouter.get(
  `${prefixOfThisArchiveWithDailyPart}`,
  dailyPartResourceMiddleware.verifyHeadersFieldsId,
  dailyPartResourceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartResourceController.all
);
dailyPartResourceRouter.get(
  `${prefixOfThisArchive}/:id`,
  dailyPartResourceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartResourceController.findById
);
dailyPartResourceRouter.delete(
  `${prefixOfThisArchive}/:id`,
  dailyPartResourceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  dailyPartResourceController.delete
);

export default dailyPartResourceRouter;

import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { dailyPartMOController } from "./dailyPartMO.controller";
import { dailyPartMOMiddleware } from "./dailyPartMO.middleware";

const dailyPartMORouter = express.Router();
const prefix = "/daily-part-mo";

dailyPartMORouter.post(
  `${prefix}`,
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

dailyPartMORouter.get(
  `${prefix}`,
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

export default dailyPartMORouter;

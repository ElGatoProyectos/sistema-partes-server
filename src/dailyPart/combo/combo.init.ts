import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { comboController } from "./combo.controller";
import { comboMiddleware } from "./combo.middlware";

const comboRouter = express.Router();
const prefix = "/daily-part-combo";
const prefixWithIdDailyPart = "/daily-part/:id/combo";

comboRouter.get(
  `${prefix}`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  comboController.all
);

comboRouter.post(
  `${prefixWithIdDailyPart}`,
  comboMiddleware.verifyHeadersFieldsId,
  comboMiddleware.verifyHeadersFieldsIdProject,
  comboMiddleware.verifyFields,
  //[message] ver roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  comboController.create
);

export default comboRouter;

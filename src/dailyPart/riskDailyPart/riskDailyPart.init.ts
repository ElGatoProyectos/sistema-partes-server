import express from "../../config/express.config";
import { riskDailyPartMiddleware } from "./riskDailyPart.middleware";
import { riskDailyPartController } from "./riskDailyPart.controller";
import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";

const riskDailyPartRouter = express.Router();
const prefix = "/risk-daily-part";

riskDailyPartRouter.post(
  `${prefix}/:id`,
  riskDailyPartMiddleware.verifyHeadersFieldsId,
  riskDailyPartMiddleware.verifyFields,
  //[message] fijarme que roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  riskDailyPartController.create
);
riskDailyPartRouter.put(
  `${prefix}/:id`,
  riskDailyPartMiddleware.verifyHeadersFieldsId,
  riskDailyPartMiddleware.verifyFieldsUpdate,
  //[message] fijarme que roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  riskDailyPartController.update
);

riskDailyPartRouter.get(
  `${prefix}/:id`,
  riskDailyPartMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  riskDailyPartController.findById
);

riskDailyPartRouter.delete(
  `${prefix}/:id`,
  riskDailyPartMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  riskDailyPartController.updateStatus
);

export default riskDailyPartRouter;

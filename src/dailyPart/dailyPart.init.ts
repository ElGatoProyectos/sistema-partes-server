import { dailyPartMiddleware } from "./dailyPart.middleware";

import express from "../config/express.config";
import { dailyPartController } from "./dailyPart.controller";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";

const dailyPartRouter = express.Router();
const prefix = "/daily-part";

dailyPartRouter.post(
  `${prefix}`,
  dailyPartMiddleware.verifyHeadersFieldsIdProject,
  //[message] fijarme que roles
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  dailyPartController.create
);

export default dailyPartRouter;

import express from "../config/express.config";
import { workforceMiddleware } from "./workforce.middleware";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { workforceController } from "./workforce.controller";

const workforceRouter = express.Router();
const prefix = "/mano-de-obra";

workforceRouter.post(
  `${prefix}`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  workforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  workforceController.create
);
workforceRouter.put(
  `${prefix}/:id`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  workforceMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  workforceController.update
);
workforceRouter.post(
  `${prefix}/upload-excel`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  workforceController.workforceReadExcel
);

workforceRouter.get(
  `${prefix}`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "ADMINISTRACION_OBRA",
  ]),
  workforceController.allWorkforce
);

workforceRouter.get(
  `${prefix}/excel`,
  // authRoleMiddleware.authorizeRoles([
  //   "ADMIN",
  //   "USER",
  //   "CONTROL_COSTOS",
  //   "ASISTENTE_CONTROL_COSTOS",
  //   "INGENIERO_PRODUCCION",
  //   "ASISTENTE_PRODUCCION",
  //   "ADMINISTRACION_OBRA",
  // ]),
  workforceController.exportExcel
);

workforceRouter.delete(
  `${prefix}/:id`,
  workforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  workforceController.delete
);

workforceRouter.patch(
  `${prefix}/:id`,
  workforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  workforceController.changeStatus
);

export default workforceRouter;

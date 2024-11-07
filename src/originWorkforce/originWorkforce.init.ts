import express from "../config/express.config";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { originWorkforceMiddleware } from "./originWorkforce.middleware";
import { originWorkforceController } from "./originWorkforce.controller";

const originWorkforce = express.Router();
const prefix = "/origin-workforce";

originWorkforce.post(
  `${prefix}`,
  originWorkforceMiddleware.verifyHeadersFieldsIdProject,
  originWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  originWorkforceController.create
);
originWorkforce.put(
  `${prefix}/:id`,
  originWorkforceMiddleware.verifyHeadersFieldsId,
  originWorkforceMiddleware.verifyHeadersFieldsIdProject,
  originWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  originWorkforceController.update
);
originWorkforce.delete(
  `${prefix}/:id`,
  originWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  originWorkforceController.updateStatus
);
originWorkforce.get(
  `${prefix}`,
  originWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  originWorkforceController.all
);
originWorkforce.get(
  `${prefix}/:id`,
  originWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  originWorkforceController.findByIdOrigin
);

export default originWorkforce;

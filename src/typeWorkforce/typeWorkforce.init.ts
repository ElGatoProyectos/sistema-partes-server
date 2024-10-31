import express from "@/config/express.config";
import { typeWorkforceController } from "./typeWorkforce.controller";
import { typeWorkforceMiddleware } from "./typeWorkforce.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const typeWorkforce = express.Router();
const prefix = "/type-workforce";

typeWorkforce.post(
  `${prefix}`,
  typeWorkforceMiddleware.verifyHeadersFieldsIdProject,
  typeWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  typeWorkforceController.create
);
typeWorkforce.put(
  `${prefix}/:id`,
  typeWorkforceMiddleware.verifyHeadersFieldsId,
  typeWorkforceMiddleware.verifyHeadersFieldsIdProject,
  typeWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  typeWorkforceController.update
);
typeWorkforce.delete(
  `${prefix}/:id`,
  typeWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  typeWorkforceController.updateStatus
);
typeWorkforce.get(
  `${prefix}`,
  typeWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  typeWorkforceController.all
);
typeWorkforce.get(
  `${prefix}/:id`,
  typeWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  typeWorkforceController.findByIdType
);

export default typeWorkforce;

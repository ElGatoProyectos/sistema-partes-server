import express from "../config/express.config";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { bankWorkforceMiddleware } from "./bankWorkforce.middleware";
import { bankWorkforceController } from "./bankWorkforce.controller";

const bankWorkforce = express.Router();
const prefix = "/bank-workforce";

bankWorkforce.post(
  `${prefix}`,
  bankWorkforceMiddleware.verifyHeadersFieldsIdProject,
  bankWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  bankWorkforceController.create
);
bankWorkforce.put(
  `${prefix}/:id`,
  bankWorkforceMiddleware.verifyHeadersFieldsId,
  bankWorkforceMiddleware.verifyHeadersFieldsIdProject,
  bankWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  bankWorkforceController.update
);
bankWorkforce.delete(
  `${prefix}/:id`,
  bankWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  bankWorkforceController.updateStatus
);
bankWorkforce.get(
  `${prefix}`,
  bankWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  bankWorkforceController.all
);
bankWorkforce.get(
  `${prefix}/:id`,
  bankWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  bankWorkforceController.findByIdOrigin
);

export default bankWorkforce;

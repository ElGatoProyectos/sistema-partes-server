import express from "../config/express.config";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { specialityWorkforceMiddleware } from "./specialtyWorkforce.middleware";
import { specialtyWorkforceController } from "./specialtyWorkforce.controller";

const specialtyWorkforce = express.Router();
const prefix = "/specialty-workforce";

specialtyWorkforce.post(
  `${prefix}`,
  specialityWorkforceMiddleware.verifyHeadersFieldsIdProject,
  specialityWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  specialtyWorkforceController.create
);
specialtyWorkforce.put(
  `${prefix}/:id`,
  specialityWorkforceMiddleware.verifyHeadersFieldsId,
  specialityWorkforceMiddleware.verifyHeadersFieldsIdProject,
  specialityWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  specialtyWorkforceController.update
);
specialtyWorkforce.delete(
  `${prefix}/:id`,
  specialityWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  specialtyWorkforceController.updateStatus
);
specialtyWorkforce.get(
  `${prefix}`,
  specialityWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  specialtyWorkforceController.all
);
specialtyWorkforce.get(
  `${prefix}/:id`,
  specialityWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "ADMINISTRACION_OBRA",
  ]),
  specialtyWorkforceController.findByIdSpecialty
);

export default specialtyWorkforce;

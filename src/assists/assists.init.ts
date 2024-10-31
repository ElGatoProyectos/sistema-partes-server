import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { assistsController } from "./assists.controller";
import { assistsWorkforceMiddleware } from "./assists.middleware";

const assistsWorkforce = express.Router();
const prefix = "/assists";

assistsWorkforce.post(
  `${prefix}`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
  ]),
  assistsController.create
);
//[note] ya no se usa pero una parte de su funcionalidad la pase a getAll
assistsWorkforce.post(
  `${prefix}/synchronization`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  assistsController.synchronization
);

assistsWorkforce.put(
  `${prefix}`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
  ]),
  assistsController.update
);
assistsWorkforce.get(
  `${prefix}`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "GERENTE_PROYECTO",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
  ]),
  assistsController.getAll
);
assistsWorkforce.get(
  `${prefix}/week-assists`,
  assistsWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "GERENTE_PROYECTO",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
  ]),
  assistsController.getAllForWeek
);

assistsWorkforce.get(
  `${prefix}/:id`,
  assistsWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "GERENTE_PROYECTO",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
  ]),
  assistsController.findById
);
assistsWorkforce.delete(
  `${prefix}/:id`,
  assistsWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
  ]),
  assistsController.updateStatus
);

export default assistsWorkforce;

import express from "../config/express.config";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { resourceController } from "./resources.controller";
import { resourcesMiddleware } from "./resources.middleware";

const resourceRouter = express.Router();
const prefix = "/resource";

resourceRouter.post(
  `${prefix}/upload-excel`,
  resourcesMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  resourceController.resourceReadExcel
);

resourceRouter.post(
  `${prefix}`,
  resourcesMiddleware.verifyHeadersFieldsIdProject,
  resourcesMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "CAPATAZ",
    "JEFE_GRUPO",
    "LOGISTICA",
    "ASISTENTE_ALMACEN",
  ]),
  resourceController.create
);

resourceRouter.put(
  `${prefix}/:id`,
  resourcesMiddleware.verifyHeadersFieldsIdProject,
  resourcesMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "CAPATAZ",
    "JEFE_GRUPO",
    "LOGISTICA",
    "ASISTENTE_ALMACEN",
  ]),
  resourceController.update
);

resourceRouter.get(
  `${prefix}`,
  resourcesMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
    "INGENIERO_SSOMMA",
    "ASISTENTE_SSOMMA",
    "LOGISTICA",
    "ASISTENTE_ALMACEN",
  ]),
  resourceController.allResources
);

resourceRouter.get(
  `${prefix}/:id`,
  resourcesMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
    "INGENIERO_SSOMMA",
    "ASISTENTE_SSOMMA",
    "LOGISTICA",
    "ASISTENTE_ALMACEN",
  ]),
  resourceController.findById
);

resourceRouter.delete(
  `${prefix}/:id`,
  resourcesMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "CAPATAZ",
    "JEFE_GRUPO",
    "LOGISTICA",
    "ASISTENTE_ALMACEN",
  ]),
  resourceController.updateStatus
);

export default resourceRouter;

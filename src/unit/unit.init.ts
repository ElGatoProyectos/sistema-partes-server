import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { unitController } from "./unit.controller";
import { unitMiddleware } from "./unit.middleware";

const unitRouter = express.Router();

const prefix = "/unit";

unitRouter.get(
  `${prefix}`,
  unitMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  unitController.allResoursesCategories
);

unitRouter.delete(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  unitController.updateStatus
);

unitRouter.get(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  unitController.findByIdUnit
);

unitRouter.post(
  `${prefix}`,
  unitMiddleware.verifyHeadersFieldsIdProject,
  unitMiddleware.verifyFieldsRegistry,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  unitController.create
);
unitRouter.post(
  `${prefix}/upload-excel`,
  unitMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  unitController.unitReadExcel
);

unitRouter.put(
  `${prefix}/:id`,
  unitMiddleware.verifyHeadersFieldsId,
  unitMiddleware.verifyHeadersFieldsIdProject,
  unitMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  unitController.update
);

export default unitRouter;

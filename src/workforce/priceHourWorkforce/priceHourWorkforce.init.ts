import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { priceHourWorkforceMiddleware } from "./priceHourWorkforce.middleware";
import { priceHourWorkforceController } from "./priceHourWorkforce.controller";

const priceHourWorkforceRouter = express.Router();
const prefix = "/price-hour";

priceHourWorkforceRouter.post(
  `${prefix}`,
  priceHourWorkforceMiddleware.verifyHeadersFieldsIdProject,
  priceHourWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  priceHourWorkforceController.create
);
priceHourWorkforceRouter.put(
  `${prefix}/:id`,
  priceHourWorkforceMiddleware.verifyHeadersFieldsId,
  priceHourWorkforceMiddleware.verifyHeadersFieldsIdProject,
  priceHourWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  priceHourWorkforceController.update
);
priceHourWorkforceRouter.get(
  `${prefix}`,
  priceHourWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "GERENTE_PROYECTO",
    "RESIDENCIA",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
    "MAESTRO_OBRA",
    "CAPATAZ",
    "JEFE_GRUPO",
    "ADMINISTRACION_OBRA",
  ]),
  priceHourWorkforceController.all
);
priceHourWorkforceRouter.get(
  `${prefix}/:id`,
  priceHourWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  priceHourWorkforceController.findById
);

export default priceHourWorkforceRouter;

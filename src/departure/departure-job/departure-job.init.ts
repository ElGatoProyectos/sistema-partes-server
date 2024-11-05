import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import express from "@/config/express.config";
import { departureJobController } from "./departure-job.controller";
import { departureJobMiddleware } from "./departureJob.middleware";

const departureJobRouter = express.Router();

const prefix = "/departure-job";

departureJobRouter.post(
  `${prefix}`,
  departureJobMiddleware.verifyFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureJobController.createDetails
);
departureJobRouter.put(
  `${prefix}/:id`,
  departureJobMiddleware.verifyHeadersFieldsId,
  departureJobMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureJobMiddleware.verifyHeadersFieldsId,
  departureJobMiddleware.verifyHeadersFieldsIdProject,
  departureJobController.updateDetails
);

departureJobRouter.post(
  `${prefix}/upload-excel`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureJobMiddleware.verifyHeadersFieldsIdProject,
  departureJobController.departureJobReadExcel
);

departureJobRouter.get(
  `${prefix}`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  departureJobMiddleware.verifyHeadersFieldsIdProject,
  departureJobController.allDetailsDepartureJob
);

departureJobRouter.get(
  `${prefix}/detail`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  departureJobMiddleware.verifyHeadersFieldsIdProject,
  departureJobController.allDetailsDepartureJobForDetail
);

departureJobRouter.delete(
  `${prefix}/:id`,
  departureJobMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  departureJobMiddleware.verifyHeadersFieldsId,
  departureJobController.updateStatus
);

export default departureJobRouter;

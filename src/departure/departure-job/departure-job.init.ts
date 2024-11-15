import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { departureJobController } from "./departure-job.controller";
import { departureJobMiddleware } from "./departureJob.middleware";

const departureJobRouter = express.Router();

const prefix = "/departure-job";
const prefixWithIdJob = "/daily-part-departure/:id";

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
  `${prefix}/excel`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  departureJobController.exportExcel
);

//[note] esto es una api para dentro de  parte diario
//[note] el id es del parte diario
departureJobRouter.get(
  `${prefixWithIdJob}`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  departureJobMiddleware.verifyHeadersFieldsId,
  departureJobMiddleware.verifyHeadersFieldsIdProject,
  departureJobController.allForJob
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

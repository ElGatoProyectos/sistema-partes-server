import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { reportWorkforceMiddleware } from "./reportWorkforce.middleware";
import { trainReportController } from "./reporWorkforce.controller";

const reportWorkforceRouter = express.Router();
const prefix = "/report-workforce";

reportWorkforceRouter.get(
  `${prefix}`,
  reportWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  trainReportController.allTrainReports
);

export default reportWorkforceRouter;

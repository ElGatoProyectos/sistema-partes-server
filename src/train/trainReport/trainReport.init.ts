import { authRoleMiddleware } from "../../auth/middlewares/auth-role.middleware";
import express from "../../config/express.config";
import { trainReportController } from "./trainReport.controller";
import { trainReportMiddleware } from "./trainReport.middleware";

const trainReportRouter = express.Router();
const prefix = "/report-train";

trainReportRouter.get(
  `${prefix}`,
  trainReportMiddleware.verifyHeadersFieldsIdProject,
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

export default trainReportRouter;

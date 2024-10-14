import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import express from "@/config/express.config";
import { departureJobController } from "./departure-job.controller";
import { departureJobMiddleware } from "./departureJob.middleware";

const departureJobRouter = express.Router();

const prefix = "/departure-job";

departureJobRouter.post(
  `${prefix}`,
  departureJobMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  departureJobController.createDetails
);

departureJobRouter.post(
  `${prefix}/upload-excel`,
  authRoleMiddleware.authAdminUser,
  departureJobController.departureJobReadExcel
);

departureJobRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminUser,
  departureJobController.allDetailsDepartureJob
);

export default departureJobRouter;

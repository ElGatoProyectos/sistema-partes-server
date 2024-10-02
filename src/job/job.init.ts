import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { jobMiddleware } from "./job.middleware";
import { jobController } from "./job.controller";

const jobRouter = express.Router();

const prefix = "/job";

jobRouter.post(
  `${prefix}`,
  jobMiddleware.verifyFields,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  jobController.create
);
jobRouter.get(
  `${prefix}`,
  jobMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  jobController.allJobs
);

jobRouter.delete(
  `${prefix}/:id`,
  jobMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  jobController.updateStatus
);

jobRouter.get(
  `${prefix}/:id`,
  jobMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  jobController.findById
);

jobRouter.put(
  `${prefix}/:id`,
  jobMiddleware.verifyHeadersFieldsId,
  jobMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
  jobController.update
);

export default jobRouter;

import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { jobMiddleware } from "./job.middleware";
import { jobController } from "./job.controller";

const jobRouter = express.Router();

const prefix = "/job";

jobRouter.post(
  `${prefix}`,
  jobMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  jobController.create
);
jobRouter.get(
  `${prefix}`,
  jobMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  jobController.allJobs
);

jobRouter.delete(
  `${prefix}/:id`,
  jobMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  jobController.updateStatus
);

jobRouter.get(
  `${prefix}/:id`,
  jobMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  jobController.findById
);

jobRouter.put(
  `${prefix}/:id`,
  jobMiddleware.verifyHeadersFieldsId,
  jobMiddleware.verifyFieldsUpdate,
  authRoleMiddleware.authAdminUser,
  jobController.update
);

jobRouter.post(
  `${prefix}/upload-excel`,
  jobMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  jobController.jobReadExcel
);

export default jobRouter;

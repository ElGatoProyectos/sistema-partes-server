import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { resourceController } from "./resources.controller";
import { resourcesMiddleware } from "./resources.middleware";
// import { resourcesMiddleware } from "./resources.middleware";

const resourceRouter = express.Router();
const prefix = "/resource";

resourceRouter.get(
  `${prefix}`,
  resourcesMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  resourceController.allResources
);

resourceRouter.post(
  `${prefix}/upload-excel`,
  resourcesMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  resourceController.resourceReadExcel
);

export default resourceRouter;

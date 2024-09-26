import express from "@/config/express.config";
import { projectController } from "./project.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { projectMiddleware } from "./project.middleware";

const projectRouter = express.Router();
const prefix = "/projects";

projectRouter.post(`${prefix}`, projectController.create);
projectRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminAndProjectManager,
  projectController.findAllProjectsXCompany
);
projectRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdminAndProjectManager,
  projectController.findByName
);
//ojo!!!! lo q pongas abajo ya q cuando coloque el /search abajo no me funcionaba la ruta
projectRouter.get(
  `${prefix}/:id`,
  authRoleMiddleware.authAdminAndProjectManager,
  projectMiddleware.verifyHeadersFields,
  projectController.findByIdProject
);
projectRouter.get(
  `${prefix}/file/:id`,
  authRoleMiddleware.authAdminAndProjectManager,
  projectMiddleware.verifyHeadersFields,
  projectController.findImage
);
projectRouter.put(`${prefix}/:id`, projectController.updateProject);
projectRouter.patch(
  `${prefix}/:id`,
  authRoleMiddleware.authAdminAndProjectManager,
  projectMiddleware.verifyHeadersFields,
  projectMiddleware.verifyFieldsUpdateState,
  projectController.updateState
);
projectRouter.delete(
  `${prefix}/:id`,
  authRoleMiddleware.authAdminAndProjectManager,
  projectMiddleware.verifyHeadersFields,
  projectController.updateStatus
);

export default projectRouter;

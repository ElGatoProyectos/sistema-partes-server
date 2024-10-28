import express from "@/config/express.config";
import { projectController } from "./project.controller";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { projectMiddleware } from "./project.middleware";

const projectRouter = express.Router();
const prefix = "/projects";

projectRouter.post(`${prefix}`, projectController.create);
projectRouter.get(
  `${prefix}`,
  projectMiddleware.verifyFieldsUpdateState,
  authRoleMiddleware.authAdminUser,
  projectController.findAllProjectsXCompany
);
projectRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdminUser,
  projectController.findByName
);
//ojo!!!! lo q pongas abajo ya q cuando coloque el /search abajo no me funcionaba la ruta
projectRouter.get(
  `${prefix}/:id`,
  authRoleMiddleware.authAdminUser,
  projectMiddleware.verifyHeadersFields,
  projectController.findByIdProject
);
projectRouter.get(
  `${prefix}/file/:id`,
  authRoleMiddleware.authAdminUser,
  projectMiddleware.verifyHeadersFields,
  projectController.findImage
);
projectRouter.put(`${prefix}/:id`, projectController.updateProject);
projectRouter.patch(
  `${prefix}/:id`,
  projectMiddleware.verifyHeadersFields,
  projectMiddleware.verifyFieldsUpdateState,
  authRoleMiddleware.authAdminUser,
  projectController.updateState
);
projectRouter.patch(
  `${prefix}/colors_project/:project_id`,
  projectMiddleware.verifyHeadersFieldsIdProject,
  projectMiddleware.verifyColors,
  authRoleMiddleware.authAdminUser,
  projectController.updateColors
);
//[note] Esto se usa para pruebas, más desde el front
projectRouter.delete(
  `${prefix}/remove-all`,
  projectController.deleteManyFromProyect
);
projectRouter.delete(
  `${prefix}/:id`,
  authRoleMiddleware.authAdminUser,
  projectMiddleware.verifyHeadersFields,
  projectController.updateStatus
);

export default projectRouter;

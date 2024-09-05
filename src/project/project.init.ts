import express from "@/config/express.config";
import { projectController } from "./project.controller";
import { userMiddleware } from "./project.middleware";
import { authAuthmiddleware } from "@/auth/middlewares/auth.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const projectRouter = express.Router();
const prefix = "/projects";

projectRouter.post(`${prefix}`, projectController.create);
projectRouter.get(
  `${prefix}/user/:id`,
  authRoleMiddleware.authViewProject,
  userMiddleware.verifyHeadersFields,
  projectController.findAllProjectsXCompany
);
projectRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authViewProject,
  projectController.findByName
);
//ojo!!!! lo q pongas abajo ya q cuando coloque el /search abajo no me funcionaba la ruta
projectRouter.get(
  `${prefix}/:id`,
  authRoleMiddleware.authViewProject,
  userMiddleware.verifyHeadersFields,
  projectController.findByIdProject
);
projectRouter.get(
  `${prefix}/file/:id`,
  authRoleMiddleware.authViewProject,
  userMiddleware.verifyHeadersFields,
  projectController.findImage
);
projectRouter.put(`${prefix}/:id`, projectController.updateProject);
projectRouter.delete(
  `${prefix}/:id`,
  authRoleMiddleware.authViewProject,
  userMiddleware.verifyHeadersFields,
  projectController.updateStatus
);

export default projectRouter;

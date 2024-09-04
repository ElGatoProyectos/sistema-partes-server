import express from "@/config/express.config";
import { projectController } from "./project.controller";

const projectRouter = express.Router();
const prefix = "/projects";

projectRouter.post(`${prefix}`, projectController.create);
projectRouter.get(`${prefix}/user/:id`, projectController.findAllProjectsXUser);
projectRouter.get(`${prefix}/:id`, projectController.findByIdProject);
projectRouter.get(`${prefix}/file/:id`, projectController.findImage);
projectRouter.put(`${prefix}/:id`, projectController.updateProject);

export default projectRouter;

import express from "@/config/express.config";
import { proyectoController } from "./proyecto.controller";

const projectRouter = express.Router();
const prefix = "/projects";

projectRouter.post(`${prefix}`, proyectoController.create);

export default projectRouter;

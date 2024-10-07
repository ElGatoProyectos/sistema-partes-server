import express from "@/config/express.config";
import { departureMiddleware } from "./departure.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { departureController } from "./departure.controller";

const departureRouter = express.Router();

const prefix = "/departure";

departureRouter.post(
  `${prefix}/upload-excel`,
  departureMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  departureController.departureReadExcel
);

export default departureRouter;

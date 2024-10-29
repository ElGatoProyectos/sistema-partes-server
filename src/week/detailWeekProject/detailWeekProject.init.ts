import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { detailWeekProjectController } from "./detailWeekProject.controller";

const detailWeekProjectRouter = express.Router();

const prefix = "/detail-week-project";

detailWeekProjectRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminUser,
  detailWeekProjectController.findAll
);

export default detailWeekProjectRouter;

import express from "../config/express.config";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { weekController } from "./week.controller";

const weekRouter = express.Router();

const prefix = "/week";

weekRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminUser,
  weekController.findWeek
);

export default weekRouter;

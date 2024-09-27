import express from "@/config/express.config";
import { authAuthmiddleware } from "@/auth/middlewares/auth.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { rolController } from "./rol.controller";
import { rolMiddleware } from "./rol.middleware";

const rolRouter = express.Router();
const prefix = "/roles";

rolRouter.post(`${prefix}`, authRoleMiddleware.authAdmin, rolController.create);

rolRouter.get(
  `${prefix}/:id`,
  rolMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManagerAndUser,
  rolController.findByIdRol
);

rolRouter.get(
  `${prefix}`,
  authRoleMiddleware.authViewAll,
  rolController.allRoles
);

export default rolRouter;

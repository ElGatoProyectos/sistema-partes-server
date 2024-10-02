import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import express from "@/config/express.config";
import { userMiddleware } from "../user.middleware";
import { detailUserProjectController } from "./detailUserProject.controller";

const detailUserProjectRouter = express.Router();

const prefix = "/users_project";

detailUserProjectRouter.get(
  `${prefix}`,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminAndProjectManagerAndUser,
  detailUserProjectController.allUsersByProject
);
detailUserProjectRouter.delete(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminAndProjectManagerAndUser,
  detailUserProjectController.deleteUserFromProject
);

export default detailUserProjectRouter;

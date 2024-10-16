import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import express from "@/config/express.config";
import { userMiddleware } from "../user.middleware";
import { detailUserProjectController } from "./detailUserProject.controller";
import { detailUserProjectMiddleware } from "./detailUserProject.middleware";

const detailUserProjectRouter = express.Router();

const prefix = "/users_project";

detailUserProjectRouter.post(
  `${prefix}/assignment`,
  detailUserProjectMiddleware.verifyFieldsAssignment,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.createDetailAssignment
);
detailUserProjectRouter.get(
  `${prefix}`,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.allUsersByProject
);
detailUserProjectRouter.get(
  `${prefix}/unassigned`,
  userMiddleware.verifyHeadersFieldsIdProjectHeader,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.allUsersByProjectUnassigned
);
detailUserProjectRouter.delete(
  `${prefix}/:id`,
  userMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.deleteUserFromProject
);

export default detailUserProjectRouter;

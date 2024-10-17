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
  detailUserProjectMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.allUsersByProject
);
detailUserProjectRouter.get(
  `${prefix}/unassigned`,
  detailUserProjectMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.allUsersByProjectUnassigned
);
detailUserProjectRouter.delete(
  `${prefix}/delete-assignment`,
  detailUserProjectMiddleware.verifyFieldsForDeleteAssignment,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.deleteDetail
);
detailUserProjectRouter.delete(
  `${prefix}/:id`,
  detailUserProjectMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.deleteUserFromProject
);

export default detailUserProjectRouter;

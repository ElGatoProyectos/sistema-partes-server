import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import express from "@/config/express.config";
import { detailUserProjectController } from "./detailUserProject.controller";
import { detailUserProjectMiddleware } from "./detailUserProject.middleware";

const detailUserProjectRouter = express.Router();

const prefix = "/users_project";

detailUserProjectRouter.post(
  `${prefix}/assignment`,
  detailUserProjectMiddleware.verifyFieldsAssignment,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  detailUserProjectController.createDetailAssignment
);
detailUserProjectRouter.get(
  `${prefix}`,
  detailUserProjectMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "GERENTE_PROYECTO",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  detailUserProjectController.allUsersByProject
);
detailUserProjectRouter.get(
  `${prefix}/available/:id`,
  detailUserProjectMiddleware.verifyHeadersFieldsId,
  detailUserProjectMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  detailUserProjectController.allUsersAvailableForAssignDetail
);
detailUserProjectRouter.get(
  `${prefix}/responsible`,
  detailUserProjectMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.allUsersResponsible
);
detailUserProjectRouter.get(
  `${prefix}/detail/:id`,
  detailUserProjectMiddleware.verifyHeadersFieldsId,
  detailUserProjectMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.allDetailAccordingToTheRole
);
detailUserProjectRouter.get(
  `${prefix}/unassigned`,
  detailUserProjectMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.allUsersByProjectUnassigned
);
detailUserProjectRouter.delete(
  `${prefix}/delete-assignment`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
  ]),
  detailUserProjectController.deleteDetail
);
detailUserProjectRouter.delete(
  `${prefix}/:id`,
  detailUserProjectMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  detailUserProjectController.deleteUserFromProject
);

export default detailUserProjectRouter;

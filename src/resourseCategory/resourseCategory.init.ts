import express from "../config/express.config";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { resourseCategoryController } from "./resourseCategory.controller";
import { resourseCategoryMiddleware } from "./resourseCategory.middleware";

const resourseCategoryRouter = express.Router();

const prefix = "/resourseCategory";

resourseCategoryRouter.get(
  `${prefix}`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  resourseCategoryMiddleware.verifyHeadersFieldsIdProject,
  resourseCategoryController.allResoursesCategories
);

resourseCategoryRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  resourseCategoryController.findByName
);

resourseCategoryRouter.get(
  `${prefix}/:id`,
  resourseCategoryMiddleware.verifyHeadersFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  resourseCategoryController.findByIdResourseCategory
);

resourseCategoryRouter.post(
  `${prefix}`,
  resourseCategoryMiddleware.verifyFieldsRegistry,
  resourseCategoryMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  resourseCategoryController.create
);

resourseCategoryRouter.put(
  `${prefix}/:id`,
  resourseCategoryMiddleware.verifyHeadersFields,
  resourseCategoryMiddleware.verifyFieldsUpdate,
  resourseCategoryMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  resourseCategoryController.update
);

resourseCategoryRouter.delete(
  `${prefix}/:id`,
  resourseCategoryMiddleware.verifyHeadersFields,
  authRoleMiddleware.authorizeRoles([
    "ADMIN",
    "USER",
    "CONTROL_COSTOS",
    "ASISTENTE_CONTROL_COSTOS",
    "INGENIERO_PRODUCCION",
    "ASISTENTE_PRODUCCION",
  ]),
  resourseCategoryController.updateStatus
);

export default resourseCategoryRouter;

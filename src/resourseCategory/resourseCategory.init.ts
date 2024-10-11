import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";
import { resourseCategoryController } from "./resourseCategory.controller";
import { resourseCategoryMiddleware } from "./resourseCategory.middleware";

const resourseCategoryRouter = express.Router();

const prefix = "/resourseCategory";

resourseCategoryRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminUser,
  resourseCategoryMiddleware.verifyHeadersFieldsIdProject,
  resourseCategoryController.allResoursesCategories
);

resourseCategoryRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdminUser,
  resourseCategoryController.findByName
);

resourseCategoryRouter.get(
  `${prefix}/:id`,
  resourseCategoryMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminUser,
  resourseCategoryController.findByIdResourseCategory
);

resourseCategoryRouter.post(
  `${prefix}`,
  resourseCategoryMiddleware.verifyFieldsRegistry,
  resourseCategoryMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  resourseCategoryController.create
);

resourseCategoryRouter.put(
  `${prefix}/:id`,
  resourseCategoryMiddleware.verifyHeadersFields,
  resourseCategoryMiddleware.verifyFieldsUpdate,
  resourseCategoryMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  resourseCategoryController.update
);

resourseCategoryRouter.delete(
  `${prefix}/:id`,
  resourseCategoryMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminUser,
  resourseCategoryController.updateStatus
);

export default resourseCategoryRouter;

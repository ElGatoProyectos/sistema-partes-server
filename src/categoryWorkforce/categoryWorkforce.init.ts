import express from "@/config/express.config";
import { categoryWorkforceMiddleware } from "./categoryWorkforce.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { categoryWorkforceController } from "./cateogoryWorkforce.controller";

const categoryWorkforce = express.Router();
const prefix = "/category-workforce";

categoryWorkforce.post(
  `${prefix}`,
  categoryWorkforceMiddleware.verifyHeadersFieldsIdProject,
  categoryWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  categoryWorkforceController.create
);
categoryWorkforce.put(
  `${prefix}/:id`,
  categoryWorkforceMiddleware.verifyHeadersFieldsId,
  categoryWorkforceMiddleware.verifyHeadersFieldsIdProject,
  categoryWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  categoryWorkforceController.update
);
categoryWorkforce.delete(
  `${prefix}/:id`,
  categoryWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  categoryWorkforceController.updateStatus
);
categoryWorkforce.get(
  `${prefix}`,
  categoryWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  categoryWorkforceController.all
);
categoryWorkforce.get(
  `${prefix}/:id`,
  categoryWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  categoryWorkforceController.findById
);

export default categoryWorkforce;

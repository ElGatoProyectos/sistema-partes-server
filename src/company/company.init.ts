import express from "@/config/express.config";
import { companyController } from "./company.controller";
import { companyMiddleware } from "./company.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const companyRouter = express.Router();

const prefix = "/companies";

companyRouter.post(`${prefix}`, companyController.create);

companyRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdmin,
  companyController.allCompanies
);

companyRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdmin,
  companyController.findByName
);
companyRouter.get(
  `${prefix}/file/:id`,
  companyMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminUser,
  companyController.findImage
);

companyRouter.get(
  `${prefix}/:id`,
  companyMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminUser,
  companyController.findByIdCompany
);

companyRouter.put(`${prefix}/:id`, companyController.update);

companyRouter.delete(
  `${prefix}/:id`,
  companyMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdmin,
  companyController.updateStatus
);

export default companyRouter;

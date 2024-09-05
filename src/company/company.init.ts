import express from "@/config/express.config";
import { requestMiddleware } from "@/common/middlewares/request.middleware";
import { companyController } from "./company.controller";
import { companyMiddleware } from "./company.middleware";

const companyRouter = express.Router();

const prefix = "/companies";

companyRouter.get(
  `${prefix}`,
  requestMiddleware.validatePagination,
  // authRoleMiddleware.authAdmin,
  companyController.allCompanies
);

companyRouter.get(
  `${prefix}/search`,
  requestMiddleware.validatePagination,
  //authRoleMiddleware.authAdmin,
  companyController.findByName
);

companyRouter.get(
  `${prefix}/:id`,
  companyMiddleware.verifyHeadersFields,
  //authRoleMiddleware.authAdmin,
  companyController.findByIdCompany
);

companyRouter.post(
  `${prefix}`,
  companyMiddleware.verifyFields,
  //authRoleMiddleware.authAdmin,
  companyController.create
);
companyRouter.put(
  `${prefix}/:id`,
  companyMiddleware.verifyHeadersFields,
  companyMiddleware.verifyFieldsUpdate,
  //authRoleMiddleware.authAdmin,
  companyController.update
);

companyRouter.delete(
  `${prefix}/:id`,
  companyMiddleware.verifyHeadersFields,
  //authRoleMiddleware.authAdmin,
  companyController.updateStatus
);

export default companyRouter;

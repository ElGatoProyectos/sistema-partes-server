import express from "../config/express.config";
import { detailUserCompanyMiddleware } from "./detailUserCompany.middleware";
import { authRoleMiddleware } from "../auth/middlewares/auth-role.middleware";
import { detailUserCompanyController } from "./detailsUserCompany.controller";

const detailUserCompanyRouter = express.Router();

const prefix = "/users_company";

detailUserCompanyRouter.get(
  `${prefix}/unassigned`,
  detailUserCompanyMiddleware.verifyHeadersFieldsIdCompanyHeader,
  authRoleMiddleware.authAdminUser,
  detailUserCompanyController.allUsersByCompanyUnassigned
);

export default detailUserCompanyRouter;

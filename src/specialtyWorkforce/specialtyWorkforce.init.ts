import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { specialityWorkforceMiddleware } from "./specialtyWorkforce.middleware";
import { specialtyWorkforceController } from "./specialtyWorkforce.controller";

const specialtyWorkforce = express.Router();
const prefix = "/specialty-workforce";

specialtyWorkforce.post(
  `${prefix}`,
  specialityWorkforceMiddleware.verifyHeadersFieldsIdProject,
  specialityWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  specialtyWorkforceController.create
);
specialtyWorkforce.put(
  `${prefix}/:id`,
  specialityWorkforceMiddleware.verifyHeadersFieldsId,
  specialityWorkforceMiddleware.verifyHeadersFieldsIdProject,
  specialityWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  specialtyWorkforceController.update
);
specialtyWorkforce.delete(
  `${prefix}/:id`,
  specialityWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  specialtyWorkforceController.updateStatus
);
specialtyWorkforce.get(
  `${prefix}`,
  specialityWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  specialtyWorkforceController.all
);
specialtyWorkforce.get(
  `${prefix}/:id`,
  specialityWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  specialtyWorkforceController.findByIdSpecialty
);

export default specialtyWorkforce;

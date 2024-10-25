import express from "@/config/express.config";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";
import { priceHourWorkforceMiddleware } from "./priceHourWorkforce.middleware";
import { priceHourWorkforceController } from "./priceHourWorkforce.controller";

const priceHourWorkforceRouter = express.Router();
const prefix = "/price-hour";

priceHourWorkforceRouter.post(
  `${prefix}`,
  priceHourWorkforceMiddleware.verifyHeadersFieldsIdProject,
  priceHourWorkforceMiddleware.verifyFields,
  authRoleMiddleware.authAdminUser,
  priceHourWorkforceController.create
);
priceHourWorkforceRouter.get(
  `${prefix}`,
  priceHourWorkforceMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authAdminUser,
  priceHourWorkforceController.all
);
priceHourWorkforceRouter.get(
  `${prefix}/:id`,
  priceHourWorkforceMiddleware.verifyHeadersFieldsId,
  authRoleMiddleware.authAdminUser,
  priceHourWorkforceController.findById
);

export default priceHourWorkforceRouter;

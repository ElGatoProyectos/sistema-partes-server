import { productionUnitController } from "./production-unit.controller";
import express from "@/config/express.config";
import { productionUnitMiddleware } from "./production-unit.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const prouductionUnitRouter = express.Router();
const prefix = "/unidad-de-produccion";

prouductionUnitRouter.post(`${prefix}`, productionUnitController.create);
prouductionUnitRouter.post(
  `${prefix}/upload-excel`,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  productionUnitController.productionUnitReadExcel
);
prouductionUnitRouter.get(
  `${prefix}`,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  productionUnitController.findAll
);
prouductionUnitRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  productionUnitController.findByName
);
prouductionUnitRouter.get(
  `${prefix}/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  productionUnitController.findById
);
prouductionUnitRouter.get(
  `${prefix}/file/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  productionUnitController.findImage
);
prouductionUnitRouter.put(`${prefix}/:id`, productionUnitController.update);
prouductionUnitRouter.delete(
  `${prefix}/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndCostControlAndUser,
  productionUnitController.updateStatus
);

export default prouductionUnitRouter;

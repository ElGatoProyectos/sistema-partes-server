import { productionUnitController } from "./production-unit.controller";
import express from "@/config/express.config";
import { productionUnitMiddleware } from "./production-unit.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const prouductionUnitRouter = express.Router();
const prefix = "/unidad-de-produccion";

prouductionUnitRouter.post(`${prefix}`, productionUnitController.create);
prouductionUnitRouter.post(
  `${prefix}/upload-excel`,
  authRoleMiddleware.authAdminAndProjectManager,
  productionUnitController.productionUnitReadExcel
);
prouductionUnitRouter.get(
  `${prefix}`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  productionUnitController.findAll
);
prouductionUnitRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authAdminAndProjectManager,
  productionUnitController.findByName
);
prouductionUnitRouter.get(
  `${prefix}/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  productionUnitController.findById
);
prouductionUnitRouter.get(
  `${prefix}/file/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  productionUnitController.findImage
);
prouductionUnitRouter.put(`${prefix}/:id`, productionUnitController.update);
prouductionUnitRouter.delete(
  `${prefix}/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authAdminAndProjectManager,
  productionUnitController.updateStatus
);

export default prouductionUnitRouter;

import { productionUnitController } from "./production-unit.controller";
import express from "@/config/express.config";
import { productionUnitMiddleware } from "./production-unit.middleware";
import { authRoleMiddleware } from "@/auth/middlewares/auth-role.middleware";

const prouductionUnitRouter = express.Router();
const prefix = "/unidad-de-produccion";

prouductionUnitRouter.post(`${prefix}`, productionUnitController.create);
prouductionUnitRouter.post(
  `${prefix}/upload-excel`,
  authRoleMiddleware.authUserAndAdminAndCostControl,
  productionUnitController.productionUnitReadExcel
);
prouductionUnitRouter.post(
  `${prefix}/upload-photo`,
  productionUnitController.uploadImageForProject
);
prouductionUnitRouter.get(
  `${prefix}`,
  authRoleMiddleware.authUserAndAdminAndCostControl,
  productionUnitController.findAll
);
prouductionUnitRouter.get(
  `${prefix}/search`,
  authRoleMiddleware.authUserAndAdminAndCostControl,
  productionUnitController.findByName
);
prouductionUnitRouter.get(
  `${prefix}/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authUserAndAdminAndCostControl,
  productionUnitController.findById
);
prouductionUnitRouter.get(
  `${prefix}/file/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authUserAndAdminAndCostControl,
  productionUnitController.findImage
);
prouductionUnitRouter.get(
  `${prefix}/sectorization/project`,
  productionUnitMiddleware.verifyHeadersFieldsIdProject,
  authRoleMiddleware.authUserAndAdminAndCostControl,
  productionUnitController.findImageSectorizacionProject
);
prouductionUnitRouter.put(`${prefix}/:id`, productionUnitController.update);
prouductionUnitRouter.delete(
  `${prefix}/:id`,
  productionUnitMiddleware.verifyHeadersFields,
  authRoleMiddleware.authUserAndAdminAndCostControl,
  productionUnitController.updateStatus
);

export default prouductionUnitRouter;

import { productionUnitController } from "./production-unit.controller";
import express from "@/config/express.config";
import { productionUnitMiddleware } from "./production-unit.middleware";
import { requestMiddleware } from "@/common/middlewares/request.middleware";

const prouductionUnitRouter = express.Router();
const prefix = "/unidad-de-produccion";

prouductionUnitRouter.post(`${prefix}`, productionUnitController.create);
prouductionUnitRouter.get(
  `${prefix}`,
  // authRoleMiddleware.authViewProject,
  productionUnitMiddleware.verifyHeadersFields,
  productionUnitController.findAll
);
prouductionUnitRouter.get(
  `${prefix}/search`,
  //falta metodo rol
  requestMiddleware.validatePagination,
  productionUnitController.findByName
);
prouductionUnitRouter.get(
  `${prefix}/:id`,
  // authRoleMiddleware.authViewProject,
  productionUnitMiddleware.verifyHeadersFields,
  productionUnitController.findById
);
prouductionUnitRouter.get(
  `${prefix}/file/:id`,
  // authRoleMiddleware.authViewProject,
  productionUnitMiddleware.verifyHeadersFields,
  productionUnitController.findImage
);
prouductionUnitRouter.put(`${prefix}/:id`, productionUnitController.update);
prouductionUnitRouter.delete(
  `${prefix}/:id`,
  // authRoleMiddleware.authViewProject,
  productionUnitMiddleware.verifyHeadersFields,
  productionUnitController.updateStatus
);

export default prouductionUnitRouter;

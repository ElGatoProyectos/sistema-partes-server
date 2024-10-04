import express from "@/config/express.config";

const departureRouter = express.Router();

const prefix = "/departure";

// departureRouter.post(
//   `${prefix}/upload-excel`,
//   jobMiddleware.verifyHeadersFieldsIdProject,
//   authRoleMiddleware.authAdminAndGeneralProjectAndCostControlAndUser,
//   jobController.jobReadExcel
// );

export default departureRouter;

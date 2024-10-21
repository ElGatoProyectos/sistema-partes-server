import "module-alias/register";

import express from "express";
import { envConfig } from "./config/env.config";
import userRouter from "./user/user.init";
import authRouter from "./auth/auth.init";
import projectRouter from "./project/project.init";
import companyRouter from "./company/company.init";
import rolRouter from "./rol/rol.init";
import prouductionUnitRouter from "./production-unit/production-unit.init";
import trainRouter from "./train/train.init";
import resourseCategoryRouter from "./resourseCategory/resourseCategory.init";
import unitRouter from "./unit/unit.init";
import unifiedIndexRouter from "./unifiedIndex/unifiedIndex.init";
import cors from "cors";
import seedRouter from "./seed/seed.init";
import jobRouter from "./job/job.init";
import detailUserProjectRouter from "./user/detailUserProject/detailUserProject.init";
import detailUserCompanyRouter from "./detailsUserCompany/detailUserCompany.init";
import departureRouter from "./departure/departure.init";
import departureJobRouter from "./departure/departure-job/departure-job.init";
import workforceRouter from "./workforce/workforce.init";
import resourceRouter from "./resources/resources.init";
import weekRouter from "./week/week.init";
import detailForemanGroupLeaderRouter from "./user/detailForemanGroupLeader/detailForemanGroupLeader.init";
import detailMasterBuilderForemanRouter from "./user/detailMasterBuilderForeman/detailMasterBuilderForeman.init";
import detailProductionEngineerMasterBuilderRouter from "./user/detailProductionEngineerMasterBuilder/detailProductionEngineerMasterBuilder.init";
import typeWorkforce from "./typeWorkforce/typeWorkforce.init";
import originWorkforce from "./originWorkforce/originWorkforce.init";
import specialtyWorkforce from "./specialtyWorkforce/specialtyWorkforce.init";
import bankWorkforce from "./bankWorkforce/bankWorkforce.init";
import categoryWorkforce from "./categoryWorkforce/categoryWorkforce.init";
import assistsWorkforce from "./assists/assists.init";
const globalPrefix = "/api";

const app = express();

app.use(express.json());
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.use(globalPrefix, userRouter);
app.use(globalPrefix, authRouter);
app.use(globalPrefix, projectRouter);
app.use(globalPrefix, companyRouter);
app.use(globalPrefix, rolRouter);
app.use(globalPrefix, prouductionUnitRouter);
app.use(globalPrefix, trainRouter);
app.use(globalPrefix, resourseCategoryRouter);
app.use(globalPrefix, unitRouter);
app.use(globalPrefix, unifiedIndexRouter);
app.use(globalPrefix, seedRouter);
app.use(globalPrefix, jobRouter);
app.use(globalPrefix, detailUserProjectRouter);
app.use(globalPrefix, detailUserCompanyRouter);
app.use(globalPrefix, departureRouter);
app.use(globalPrefix, departureJobRouter);
app.use(globalPrefix, workforceRouter);
app.use(globalPrefix, resourceRouter);
app.use(globalPrefix, weekRouter);
app.use(globalPrefix, detailForemanGroupLeaderRouter);
app.use(globalPrefix, detailMasterBuilderForemanRouter);
app.use(globalPrefix, detailProductionEngineerMasterBuilderRouter);
app.use(globalPrefix, typeWorkforce);
app.use(globalPrefix, originWorkforce);
app.use(globalPrefix, specialtyWorkforce);
app.use(globalPrefix, bankWorkforce);
app.use(globalPrefix, categoryWorkforce);
app.use(globalPrefix, assistsWorkforce);

app.listen(envConfig.port, () => {
  console.log(`listening on port ${envConfig.port}`);
});

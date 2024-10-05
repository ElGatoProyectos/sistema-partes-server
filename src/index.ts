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

app.listen(envConfig.port, () => {
  console.log(`listening on port ${envConfig.port}`);
});

import "module-alias/register";

import express from "express";
import { envConfig } from "./config/env.config";
import userRouter from "./user/user.init";
import authRouter from "./auth/auth.init";
import projectRouter from "./project/project.init";
import companyRouter from "./company/company.init";
import rolRouter from "./rol/rol.init";
import prouductionUnitRouter from "./production-unit/production-unit.init";

const globalPrefix = "/api";

const app = express();

app.use(express.json());

app.use(globalPrefix, userRouter);
app.use(globalPrefix, authRouter);
app.use(globalPrefix, projectRouter);
app.use(globalPrefix, companyRouter);
app.use(globalPrefix, rolRouter);
app.use(globalPrefix, prouductionUnitRouter);

app.listen(envConfig.port, () => {
  console.log(`listening on port ${envConfig.port}`);
});

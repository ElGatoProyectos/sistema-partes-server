import "module-alias/register";

import express from "express";
import { envConfig } from "./config/env.config";
import userRouter from "./user/user.init";
import authRouter from "./auth/auth.init";

const globalPrefix = "/api";

const app = express();

app.use(express.json());

app.use(globalPrefix, userRouter);
app.use(globalPrefix, authRouter);

app.listen(envConfig.port, () => {
  console.log(`listening on port ${envConfig.port}`);
});

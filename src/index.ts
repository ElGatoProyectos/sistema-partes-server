import express from "express";
import { envConfig } from "./config/env.config";
import userRouter from "./user/user.init";
const globalPrefix = "/api";
const app = express();
app.use(express.json());
app.use(globalPrefix, userRouter);
app.listen(envConfig.port, () => {
  console.log(`listening on port ${envConfig.port}`);
});

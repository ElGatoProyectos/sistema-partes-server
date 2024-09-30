"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const env_config_1 = require("./config/env.config");
const user_init_1 = __importDefault(require("./user/user.init"));
const auth_init_1 = __importDefault(require("./auth/auth.init"));
const project_init_1 = __importDefault(require("./project/project.init"));
const company_init_1 = __importDefault(require("./company/company.init"));
const rol_init_1 = __importDefault(require("./rol/rol.init"));
const production_unit_init_1 = __importDefault(require("./production-unit/production-unit.init"));
const train_init_1 = __importDefault(require("./train/train.init"));
const resourseCategory_init_1 = __importDefault(require("./resourseCategory/resourseCategory.init"));
const unit_init_1 = __importDefault(require("./unit/unit.init"));
const unifiedIndex_init_1 = __importDefault(require("./unifiedIndex/unifiedIndex.init"));
const cors_1 = __importDefault(require("cors"));
const seed_init_1 = __importDefault(require("./seed/seed.init"));
const job_init_1 = __importDefault(require("./job/job.init"));
const globalPrefix = "/api";
const app = (0, express_1.default)();
app.use(express_1.default.json());
var corsOptions = {
    origin: "*",
};
app.use((0, cors_1.default)(corsOptions));
app.use(globalPrefix, user_init_1.default);
app.use(globalPrefix, auth_init_1.default);
app.use(globalPrefix, project_init_1.default);
app.use(globalPrefix, company_init_1.default);
app.use(globalPrefix, rol_init_1.default);
app.use(globalPrefix, production_unit_init_1.default);
app.use(globalPrefix, train_init_1.default);
app.use(globalPrefix, resourseCategory_init_1.default);
app.use(globalPrefix, unit_init_1.default);
app.use(globalPrefix, unifiedIndex_init_1.default);
app.use(globalPrefix, seed_init_1.default);
app.use(globalPrefix, job_init_1.default);
app.listen(env_config_1.envConfig.port, () => {
    console.log(`listening on port ${env_config_1.envConfig.port}`);
});

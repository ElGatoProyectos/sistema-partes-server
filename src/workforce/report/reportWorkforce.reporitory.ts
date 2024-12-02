import { T_FindAlReportlWorkforce } from "./models/reportWorkforce.types";

  
  export abstract class ReportWorkforceRepository {
    findAll(skip: number, data: T_FindAlReportlWorkforce, project_id: number): void {}
  }
  
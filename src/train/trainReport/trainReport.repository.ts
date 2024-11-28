import { Semana } from "@prisma/client";
import { I_CreateReportTrainBD, I_UpdateReportTrainBD } from "./models/trainReport.interface";
import { T_FindAllTrainReport } from "./models/trainReport.types";

export abstract class TrainReportRepository {
  findByIdTrain(train_id: number): void {}

  findByIdTrainAndWeek(train_id: number,week_id:number): void {}

  createReportsForTrain(data:I_CreateReportTrainBD):void{}

  updateReportsForTrain(report_train_id:number,value:number,day:string,current_executed:number,total:number):void{}

  updateReportsForEjecutedPrevious(report_train_id:number,executed_previous:number):void{}

  findAll(skip: number, data: T_FindAllTrainReport, project_id: number):void{}
}

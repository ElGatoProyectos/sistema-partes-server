import { I_CreateReportTrainBD, I_UpdateReportTrainBD } from "./models/trainReport.interface";

export abstract class TrainReportRepository {
  findByIdTrain(train_id: number): void {}

  findByIdTrainAndWeek(train_id: number,week_id:number): void {}

  createReportsForTrain(data:I_CreateReportTrainBD):void{}

  updateReportsForTrain(report_train_id:number,value:number,fieldDay:string):void{}
}

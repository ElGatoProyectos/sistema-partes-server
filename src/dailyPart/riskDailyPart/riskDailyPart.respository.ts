import {
  I_CreateRiskDailyPartBD,
  I_UpdateRiskDailyPartBD,
} from "./models/riskDailyPart.interface";

export abstract class RiskDailyPartRepository {
  createRiskDailyPart(data: I_CreateRiskDailyPartBD): void {}
  updateRiskDailyPart(
    data: I_UpdateRiskDailyPartBD,
    risk_daily_part: number
  ): void {}
  findById(risk_daily_part: number): void {}
  updateStateRiskDailyPart(risk_daily_part: number): void {}
}

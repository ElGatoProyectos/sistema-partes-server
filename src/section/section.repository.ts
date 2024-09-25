import { I_CreateSeccionBD } from "./models/section.repository";

export abstract class SectionRepository {
  createSection(data: I_CreateSeccionBD): void {}

  findById(section_id: number): void {}
}

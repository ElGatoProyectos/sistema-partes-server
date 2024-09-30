"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRepository = void 0;
class UnitRepository {
    findAll(skip, limit, project_id) { }
    findByCode(code, project_id) { }
    findById(idUnit) { }
    codeMoreHigh(project_id) { }
    existsName(name, project_id) { }
    existsSymbol(symbol, project_id) { }
    createUnit(data) { }
    updateUnit(data, idUnit) { }
    updateStatusUnit(idResourseCategory) { }
    searchNameUnit(name, skip, limit, project_id) { }
}
exports.UnitRepository = UnitRepository;

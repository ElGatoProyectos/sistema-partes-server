"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionUnitResponseMapper = void 0;
class ProductionUnitResponseMapper {
    constructor(productionUnit) {
        this.id = productionUnit.id;
        this.codigo = productionUnit.codigo;
        this.nombre = productionUnit.nombre;
        this.nota = productionUnit.nota ? productionUnit.nota : "";
        this.proyecto_id = productionUnit.proyecto_id;
        this.fecha_creacion = productionUnit.fecha_creacion;
    }
}
exports.ProductionUnitResponseMapper = ProductionUnitResponseMapper;

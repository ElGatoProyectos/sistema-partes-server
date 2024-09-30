"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedIndexResponseMapper = void 0;
class UnifiedIndexResponseMapper {
    constructor(unifiedIndex) {
        this.id = unifiedIndex.id;
        this.codigo = unifiedIndex.codigo;
        this.nombre = unifiedIndex.nombre;
        this.simbolo = unifiedIndex.simbolo ? unifiedIndex.simbolo : "";
        this.comentario = unifiedIndex.comentario ? unifiedIndex.comentario : "";
        this.empresa_id = unifiedIndex.empresa_id;
        this.fecha_creacion = unifiedIndex.fecha_creacion;
    }
}
exports.UnifiedIndexResponseMapper = UnifiedIndexResponseMapper;

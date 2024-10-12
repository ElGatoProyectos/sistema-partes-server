"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceService = void 0;
const unifiedIndex_validation_1 = require("./../unifiedIndex/unifiedIndex.validation");
const xlsx = __importStar(require("xlsx"));
const http_response_1 = require("@/common/http.response");
const project_validation_1 = require("@/project/project.validation");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const resources_validation_1 = require("./resources.validation");
const resourseCategory_validation_1 = require("@/resourseCategory/resourseCategory.validation");
const unit_validation_1 = require("@/unit/unit.validation");
class ResourceService {
    registerResourceMasive(file, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = file.buffer;
                const workbook = xlsx.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetToJson = xlsx.utils.sheet_to_json(sheet);
                let error = 0;
                let errorNumber = 0;
                let errorRows = [];
                //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
                //[NOTE] SI HAY 2 FILAS AL PRINCIPIO VACIAS
                //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
                //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
                //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
                //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
                //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO
                //[NOTE] ACÁ VERIFICA SI HAY 2 FILAS VACIAS
                //Usamos rango 0 para verificar q estamos leyendo las primeras filas
                const firstTwoRows = xlsx.utils
                    .sheet_to_json(sheet, { header: 1, range: 0, raw: true })
                    .slice(0, 2); //nos limitamos a las primeras 2
                //verificamos si están vacias las primeras filas
                const isEmptyRow = (row) => row.every((cell) => cell === null || cell === undefined || cell === "");
                //verificamos si tiene menos de 2 filas o si en las primeras 2 esta vacia lanzamos el error
                if (firstTwoRows.length < 2 ||
                    (isEmptyRow(firstTwoRows[0]) && isEmptyRow(firstTwoRows[1]))) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                const project = yield project_validation_1.projectValidation.findById(project_id);
                if (!project.success)
                    return project;
                const responseProject = project.payload;
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item["NOMBRE INDICE UNIFICADO"] === undefined ||
                        item.CODIGO == undefined ||
                        item["NOMBRE DEL RECURSO"] === undefined ||
                        item.UNIDAD === undefined ||
                        item["NOMBRE CATEGORIA RECURSO"] === undefined) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.El NOMBRE INDICE UNIFICADO,CODIGO, NOMBRE DEL RECURSO, UNIDAD, NOMBRE CATEGORIA RECURSO son obligatorios.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[note] buscar si existe el nombre del Indice Unificado
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const unifiedIndexResponse = yield unifiedIndex_validation_1.unifiedIndexValidation.findByName(item["NOMBRE INDICE UNIFICADO"].trim(), responseProject.id);
                    if (!unifiedIndexResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre del Indice Unificado no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el nombre de la Unidad
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(item.UNIDAD.trim(), responseProject.id);
                    if (!unitResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre de la Unidad no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el nombre de la Categoria del Recurso
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const resourceCategoryResponse = yield resourseCategory_validation_1.resourseCategoryValidation.existsName(item["NOMBRE CATEGORIA RECURSO"].trim(), responseProject.id);
                    if (!resourceCategoryResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre de la Categoria del Recurso no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //  [SUCCESS] Guardo o actualizo el Recursoo
                let resourceResponse;
                let resource;
                for (const item of sheetToJson) {
                    resourceResponse = yield resources_validation_1.resourceValidation.findByNameValidation(String(item["NOMBRE DEL RECURSO"].trim()), project_id);
                    if (resourceResponse.success) {
                        resource = resourceResponse.payload;
                        yield resources_validation_1.resourceValidation.updateResource(item, +resource.id, responseProject.id);
                    }
                    else {
                        const resourceCategoryResponse = yield resourseCategory_validation_1.resourseCategoryValidation.existsName(item["NOMBRE CATEGORIA RECURSO"].trim(), project_id);
                        const resourceCategory = resourceCategoryResponse.payload;
                        const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(item.UNIDAD, project_id);
                        const unit = unitResponse.payload;
                        const unifiedIndexResponse = yield unifiedIndex_validation_1.unifiedIndexValidation.findByName(item["NOMBRE INDICE UNIFICADO"].trim(), project_id);
                        const unifiedIndex = unifiedIndexResponse.payload;
                        const lastResource = yield resources_validation_1.resourceValidation.codeMoreHigh(project_id);
                        const lastResourceFind = lastResource.payload;
                        // Incrementar el código en 1
                        const nextCodigo = (parseInt(lastResourceFind === null || lastResourceFind === void 0 ? void 0 : lastResourceFind.codigo) || 0) + 1;
                        const formattedCodigo = nextCodigo.toString().padStart(4, "0");
                        yield prisma_config_1.default.recurso.create({
                            data: {
                                codigo: formattedCodigo,
                                nombre: item["NOMBRE DEL RECURSO"],
                                precio: item.PRECIO ? parseInt(item.PRECIO) : null,
                                unidad_id: unit.id,
                                proyecto_id: project_id,
                                id_unificado: unifiedIndex.id,
                                categoria_recurso_id: resourceCategory.id,
                            },
                        });
                    }
                }
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Recursos creados correctamente!");
            }
            catch (error) {
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer los Recursos", error);
            }
        });
    }
}
exports.resourceService = new ResourceService();

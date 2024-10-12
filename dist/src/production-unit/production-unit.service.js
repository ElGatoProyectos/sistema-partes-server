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
exports.productionUnitService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_production_unit_repository_1 = require("./prisma-production-unit.repository");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const promises_1 = __importDefault(require("fs/promises"));
const xlsx = __importStar(require("xlsx"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const production_unit_constant_1 = require("./models/production-unit.constant");
const productionUnit_validation_1 = require("./productionUnit.validation");
const project_validation_1 = require("@/project/project.validation");
const production_unit_mapper_1 = require("./mappers/production-unit.mapper");
const validator_1 = __importDefault(require("validator"));
class ProductionUnitService {
    createProductionUnit(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultNameProjectUnit = yield productionUnit_validation_1.productionUnitValidation.findByName(data.nombre);
                if (!resultNameProjectUnit.success) {
                    return resultNameProjectUnit;
                }
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear la Unidad de Producción con el id del proyecto proporcionado");
                }
                const formattedCodigo = yield this.getNextProductionUnitCode(project_id);
                const productionUnit = Object.assign(Object.assign({}, data), { codigo: formattedCodigo, proyecto_id: project_id });
                const responseProductionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.createProductionUnit(productionUnit);
                const prouductionUnitMapper = new production_unit_mapper_1.ProductionUnitResponseMapper(responseProductionUnit);
                return http_response_1.httpResponse.CreatedResponse("Unidad de produccion creada correctamente", prouductionUnitMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear la Unidad de producción", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    getNextProductionUnitCode(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastProductionUnit = yield productionUnit_validation_1.productionUnitValidation.codeMoreHigh(project_id);
            const lastProductionUnitResponse = lastProductionUnit.payload;
            // Incrementar el código en 1
            const nextCodigo = (parseInt(lastProductionUnitResponse === null || lastProductionUnitResponse === void 0 ? void 0 : lastProductionUnitResponse.codigo) || 0) + 1;
            // Formatear el código con ceros a la izquierda
            return nextCodigo.toString().padStart(3, "0");
        });
    }
    updateProductionUnit(data, productionUnit_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdProductionUnit = yield productionUnit_validation_1.productionUnitValidation.findById(productionUnit_id);
                if (!resultIdProductionUnit.success) {
                    return http_response_1.httpResponse.BadRequestException("No se pudo encontrar el id de la Unidad de Producción que se quiere editar");
                }
                const resultProductionUnit = resultIdProductionUnit.payload;
                if (resultProductionUnit.nombre != data.nombre) {
                    const resultNameProjectUnit = yield productionUnit_validation_1.productionUnitValidation.findByName(data.nombre);
                    if (!resultNameProjectUnit.success) {
                        return resultNameProjectUnit;
                    }
                }
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear la unidad de producción con el id del proyecto proporcionado");
                }
                const productionUnit = Object.assign(Object.assign({}, data), { proyecto_id: project_id });
                const responseProductionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.updateProductionUnit(productionUnit, productionUnit_id);
                const prouductionUnitMapper = new production_unit_mapper_1.ProductionUnitResponseMapper(responseProductionUnit);
                return http_response_1.httpResponse.SuccessResponse("Unidad de producción modificada correctamente", prouductionUnitMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar la Unidad de Producción", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findIdImage(idProductionUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnitResponse = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.findById(idProductionUnit);
                if (!productionUnitResponse)
                    return http_response_1.httpResponse.NotFoundException("No se ha podido encontrar la Unidad de Producción");
                const productionUnit = productionUnitResponse;
                const imagePath = app_root_path_1.default +
                    "/static/" +
                    production_unit_constant_1.ProductionUnitMulterProperties.folder +
                    "/" +
                    production_unit_constant_1.ProductionUnitMulterProperties.folder +
                    "_" +
                    productionUnit.id +
                    ".png";
                try {
                    // se verifica primero si el archivo existe en el path que colocaste y luego si es accesible
                    yield promises_1.default.access(imagePath, promises_1.default.constants.F_OK);
                }
                catch (error) {
                    return http_response_1.httpResponse.BadRequestException(" La Imagen de la Unidad de Producción fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("Imagen encontrada", imagePath);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la imagen de la Unidad de Producción", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect;
            }
        });
    }
    findIdImageSectorizacion(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectResponse = yield project_validation_1.projectValidation.findById(project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                const project = projectResponse.payload;
                const imagePath = app_root_path_1.default +
                    "/static/" +
                    production_unit_constant_1.ProductionUnitMulterFileProject.folder +
                    "/" +
                    "Project" +
                    "_" +
                    project.id +
                    ".png";
                console.log(imagePath);
                try {
                    // se verifica primero si el archivo existe en el path que colocaste y luego si es accesible
                    yield promises_1.default.access(imagePath, promises_1.default.constants.F_OK);
                }
                catch (error) {
                    return http_response_1.httpResponse.BadRequestException(" La Imagen de la Sectorización del Proyecto no fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("Imagen encontrada", imagePath);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la imagen de la Sectorización del Proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect;
            }
        });
    }
    findById(idProductionUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.findById(idProductionUnit);
                if (!productionUnit) {
                    return http_response_1.httpResponse.NotFoundException("El id de la Unidad de Producción no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Unidad de producción encontrado", productionUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Unidad de producción", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByName(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.searchNameProductionUnit(name, skip, data.queryParams.limit);
                const { productionUnits, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: productionUnits,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar la Unidad de Producción", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Unidad de Producción", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAll(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const projectResponse = yield project_validation_1.projectValidation.findById(+project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                const result = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.findAllPagination(skip, data, project_id);
                const { productionUnits, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: productionUnits,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todas las Unidades de Producción", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas las Unidades de Producción", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusProject(idProductionUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectResponse = yield productionUnit_validation_1.productionUnitValidation.findById(idProductionUnit);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                else {
                    const result = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.updateStatusProductionUnit(idProductionUnit);
                    return http_response_1.httpResponse.SuccessResponse("Unidad de Producción eliminada correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar la Unidad de Producción", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    registerProductionUnitMasive(file, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = file.buffer;
                const workbook = xlsx.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetToJson = xlsx.utils.sheet_to_json(sheet);
                let error = 0;
                let errorMessages = [];
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
                const project = yield project_validation_1.projectValidation.findById(projectId);
                if (!project.success)
                    return project;
                const responseProject = project.payload;
                let errorNumber = 0;
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item.CODIGO == undefined || item.NOMBRE == undefined) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Los campos CODIGO, NOMBRE Y NOTA son obligatorios.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[note] Acá verificamos que el codigo no tenga letras ni que sea menor que el anterior
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const codigoSinEspacios = item.CODIGO.trim();
                    //verificamos si tenemos el codigo
                    //verificamos si tenemos el codigo
                    const codigo = parseInt(item.CODIGO, 10); // Intenta convertir el string a número
                    if (!validator_1.default.isNumeric(codigoSinEspacios)) {
                        errorNumber++; // Aumenta si el código no es un número válido
                    }
                    else {
                        // Verifica si el código ya ha sido procesado
                        if (!seenCodes.has(item.CODIGO)) {
                            // errorNumber++; // Aumenta si hay duplicado
                            seenCodes.add(item.CODIGO);
                        }
                        // Verifica si el código actual no es mayor que el anterior
                        if (previousCodigo !== null && codigo <= previousCodigo) {
                            errorNumber++;
                            errorRows.push(index);
                        }
                        previousCodigo = codigo;
                    }
                })));
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Hay letras en códigos o el mismo puede que sea mayor o igual al siguiente.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[NOTE] Acá verifico si el primer elemento es 001
                const sortedCodesArray = Array.from(seenCodes)
                    .map((item) => item.padStart(3, "0"))
                    .sort((a, b) => parseInt(a) - parseInt(b));
                if (sortedCodesArray[0] != "001") {
                    errorNumber++;
                }
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException("El primer código del archivo debe ser 001");
                }
                //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
                for (let i = 1; i < sortedCodesArray.length; i++) {
                    const currentCode = parseInt(sortedCodesArray[i]);
                    const previousCode = parseInt(sortedCodesArray[i - 1]);
                    if (currentCode !== previousCode + 1) {
                        errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
                        errorRows.push(i);
                    }
                }
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Existen uno o varios códigos donde la diferencia es mayor a 1`);
                }
                //[SUCCESS] Guardo o actualizo la Unidad de Producción
                let code;
                let productionUnit;
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    code = yield productionUnit_validation_1.productionUnitValidation.findByCode(String(item.CODIGO.trim()), responseProject.id);
                    if (!code.success) {
                        productionUnit = code.payload;
                        yield productionUnit_validation_1.productionUnitValidation.updateProductionUnit(item, +productionUnit.id, responseProject.id);
                    }
                    else {
                        yield prisma_config_1.default.unidadProduccion.create({
                            data: {
                                codigo: String(item.CODIGO.trim()),
                                nombre: item.NOMBRE,
                                nota: item.NOTA ? item.NOTA : null,
                                proyecto_id: responseProject.id,
                            },
                        });
                    }
                })));
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Unidad de producción creada correctamente!");
            }
            catch (error) {
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer la Unidad de Producción", error);
            }
        });
    }
}
exports.productionUnitService = new ProductionUnitService();

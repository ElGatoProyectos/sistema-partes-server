import * as xlsx from "xlsx";
import {
  I_CreateWorkforceBDValidation,
  I_UpdateWorkforceBody,
  I_WorkforceExcel,
} from "./models/workforce.interface";
import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { projectValidation } from "@/project/project.validation";
import {
  CategoriaObrero,
  E_Estado_MO_BD,
  EspecialidadObrero,
  ManoObra,
  Proyecto,
  Unidad,
  Usuario,
} from "@prisma/client";
import prisma from "@/config/prisma.config";
import { specialtyWorkforceValidation } from "@/specialtyWorkforce/specialtyWorkfoce.validation";
import { unitValidation } from "@/unit/unit.validation";
import { categoryWorkforceValidation } from "@/categoryWorkforce/categoryWorkforce.validation";
import { workforceValidation } from "./workforce.validation";
import { T_FindAllWorkforce } from "./models/workforce.types";
import { prismaWorkforceRepository } from "./prisma-workforce.repository";
import { converToDate } from "@/common/utils/date";
import { userValidation } from "@/user/user.validation";
import validator from "validator";
import { typeWorkforceValidation } from "@/typeWorkforce/typeWorkforce.validation";
import { originWorkforceValidation } from "@/originWorkforce/originWorkforce.validation";

class WorkforceService {
  async createWorkforce(
    data: I_CreateWorkforceBDValidation,
    project_id: number
  ) {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return resultIdProject;
      }

      const categoryWorkforceResponse =
        await categoryWorkforceValidation.findById(data.categoria_obrero_id);
      if (!categoryWorkforceResponse.success) {
        return categoryWorkforceResponse;
      }

      const specialityWorkforceResponse =
        await specialtyWorkforceValidation.findById(
          data.especialidad_obrero_id
        );
      if (!specialityWorkforceResponse.success) {
        return specialityWorkforceResponse;
      }

      if (data.documento_identidad.length > 8) {
        return httpResponse.BadRequestException(
          "El dni ingresado debe contener solo 8 números"
        );
      }

      if (data.email_personal) {
        if (!validator.isEmail(data.email_personal)) {
          return httpResponse.BadRequestException(
            "El formato del email ingresado no es válido"
          );
        }
      }
      const lastWorkforce = await workforceValidation.codeMoreHigh(project_id);
      const lastWorkforceResponse = lastWorkforce.payload as ManoObra;

      // Incrementar el código en 1
      const nextCodigo = (parseInt(lastWorkforceResponse?.codigo) || 0) + 1;

      const formattedCodigo = nextCodigo.toString().padStart(3, "0");

      let user: Usuario | undefined = undefined;
      if (data.usuario_id) {
        const userResponse = await userValidation.findById(data.usuario_id);
        if (!userResponse) return userResponse;
        user = userResponse.payload as Usuario;
      }

      let fecha_nacimiento: Date | null = null;
      if (data.fecha_nacimiento) {
        fecha_nacimiento = converToDate(data.fecha_inicio);
      }

      let fecha_inicio: Date | null = null;
      if (data.fecha_inicio) {
        fecha_inicio = converToDate(data.fecha_inicio);
      }

      let fecha_finalizacion: Date | null = null;
      if (data.fecha_cese) {
        fecha_finalizacion = converToDate(data.fecha_cese);
      }

      if (fecha_inicio && fecha_finalizacion) {
        if (fecha_finalizacion < fecha_inicio) {
          return httpResponse.BadRequestException(
            "La fecha de Finalización debe ser mayor o igual a la fecha de inicio"
          );
        }
      }

      const workforceFormat = {
        ...data,
        codigo: formattedCodigo,
        telefono: data.telefono,
        categoria_obrero_id: +data.categoria_obrero_id,
        especialidad_obrero_id: +data.especialidad_obrero_id,
        fecha_nacimiento: fecha_nacimiento,
        fecha_inicio: fecha_inicio,
        fecha_cese: fecha_finalizacion,
        proyecto_id: +project_id,
        usuario_id: user ? user.id : null,
      };
      const responseWorkforce = await prismaWorkforceRepository.createWorkforce(
        workforceFormat
      );
      return httpResponse.SuccessResponse(
        "Mano de Obra creada correctamente",
        responseWorkforce
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al crear la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateWorkforce(
    data: I_UpdateWorkforceBody,
    workforce_id: number,
    project_id: number
  ) {
    try {
      const resultIdWorkforce = await workforceValidation.findById(
        workforce_id
      );
      if (!resultIdWorkforce.success) {
        return resultIdWorkforce;
      }
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return resultIdProject;
      }

      const categoryWorkforceResponse =
        await categoryWorkforceValidation.findById(data.categoria_obrero_id);
      if (!categoryWorkforceResponse.success) {
        return categoryWorkforceResponse;
      }

      const specialityWorkforceResponse =
        await specialtyWorkforceValidation.findById(
          data.especialidad_obrero_id
        );
      if (!specialityWorkforceResponse.success) {
        return specialityWorkforceResponse;
      }

      if (data.documento_identidad.length > 8) {
        return httpResponse.BadRequestException(
          "El dni ingresado debe contener solo 8 números"
        );
      }

      if (data.email_personal) {
        if (!validator.isEmail(data.email_personal)) {
          return httpResponse.BadRequestException(
            "El formato del email ingresado no es válido"
          );
        }
      }

      let user: Usuario | undefined = undefined;
      if (data.usuario_id) {
        const userResponse = await userValidation.findById(data.usuario_id);
        if (!userResponse) return userResponse;
        user = userResponse.payload as Usuario;
      }

      let fecha_nacimiento: Date | null = null;
      if (data.fecha_nacimiento) {
        fecha_nacimiento = converToDate(data.fecha_inicio);
      }

      let fecha_inicio: Date | null = null;
      if (data.fecha_inicio) {
        fecha_inicio = converToDate(data.fecha_inicio);
      }

      let fecha_finalizacion: Date | null = null;
      if (data.fecha_cese) {
        fecha_finalizacion = converToDate(data.fecha_cese);
      }

      if (fecha_inicio && fecha_finalizacion) {
        if (fecha_finalizacion < fecha_inicio) {
          return httpResponse.BadRequestException(
            "La fecha de Finalización debe ser mayor o igual a la fecha de inicio"
          );
        }
      }

      const workforceFormat = {
        ...data,
        telefono: data.telefono,
        categoria_obrero_id: +data.categoria_obrero_id,
        especialidad_obrero_id: +data.especialidad_obrero_id,
        fecha_nacimiento: fecha_nacimiento,
        fecha_inicio: fecha_inicio,
        fecha_cese: fecha_finalizacion,
        proyecto_id: +project_id,
        usuario_id: user ? user.id : null,
      };
      const responseWorkforce = await prismaWorkforceRepository.updateWorkforce(
        workforceFormat,
        workforce_id
      );
      return httpResponse.SuccessResponse(
        "Mano de Obra modificada correctamente",
        responseWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async registerWorkforceMasive(file: any, project_id: number) {
    try {
      const buffer = file.buffer;

      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetToJson = xlsx.utils.sheet_to_json(sheet) as I_WorkforceExcel[];
      let error = 0;
      let errorRows: number[] = [];

      //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
      //[NOTE] SI HAY 2 FILAS AL PRINCIPIO VACIAS
      //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
      //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
      //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
      //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
      //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO

      //[NOTE] ACÁ VERIFICA SI HAY 2 FILAS VACIAS
      //Usamos rango 0 para verificar q estamos leyendo las primeras filas
      const firstTwoRows: any = xlsx.utils
        .sheet_to_json(sheet, { header: 1, range: 0, raw: true })
        .slice(0, 2); //nos limitamos a las primeras 2
      //verificamos si están vacias las primeras filas
      const isEmptyRow = (row: any[]) =>
        row.every((cell) => cell === null || cell === undefined || cell === "");
      //verificamos si tiene menos de 2 filas o si en las primeras 2 esta vacia lanzamos el error
      if (
        firstTwoRows.length < 2 ||
        (isEmptyRow(firstTwoRows[0]) && isEmptyRow(firstTwoRows[1]))
      ) {
        return httpResponse.BadRequestException(
          "Error al leer el archivo. Verificar los campos"
        );
      }
      const project = await projectValidation.findById(project_id);
      if (!project.success) return project;
      const responseProject = project.payload as Proyecto;

      //[note] aca si hay espacio en blanco.
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;
          if (
            item.DNI === undefined ||
            item.NOMBRES === undefined ||
            item.CATEGORIA === undefined ||
            item.ESPECIALIDAD === undefined
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo.El DNI,NOMBRE, TIPO, ORIGEN, CATEGORIA, ESPECIALIDAD, UNIDAD son obligatorios.Verificar las filas: ${errorRows.join(
            ", "
          )}.`
        );
      }

      //[note] buscar si existe el TIPO de Mano de Obra
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const typeResponse = await typeWorkforceValidation.findByName(
            item.TIPO.trim(),
            responseProject.id
          );
          if (!typeResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre del Tipo de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el ORIGEN de Mano de Obra
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const originResponse = await originWorkforceValidation.findByName(
            item.ORIGEN.trim(),
            responseProject.id
          );
          if (!originResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre del Origen de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el nombre de la Categoria
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const categoryResponse = await categoryWorkforceValidation.findByName(
            item.CATEGORIA.trim(),
            responseProject.id
          );
          if (!categoryResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El nombre de la Categoria de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }
      //[note] buscar si existe el nombre de la Especialidad
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;

          const specialtyResponse =
            await specialtyWorkforceValidation.findByName(
              item.ESPECIALIDAD.trim(),
              responseProject.id
            );
          if (!specialtyResponse.success) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );

      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. La Especialidad del Origen de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      //[note] Verifico si el estado es uno de los que existen
      await Promise.all(
        sheetToJson.map(async (item: I_WorkforceExcel, index: number) => {
          index++;
          if (
            item.ESTADO.toUpperCase() != E_Estado_MO_BD.ACTIVO &&
            item.ESTADO.toUpperCase() != E_Estado_MO_BD.INACTIVO
          ) {
            error++;
            errorRows.push(index + 1);
          }
        })
      );
      if (error > 0) {
        return httpResponse.BadRequestException(
          `Error al leer el archivo. El Estado de la Mano de Obra sólo puede ser Activo o Inactivo. Fallo en las siguientes filas: ${errorRows.join(
            ", "
          )}`
        );
      }

      // //[SUCCESS] Guardo o actualizo la Mano de Obraa
      let workforceResponse;
      let workforce;
      for (const item of sheetToJson) {
        workforceResponse = await workforceValidation.findByDni(
          item.DNI.toString(),
          project_id
        );
        if (workforceResponse.success) {
          workforce = workforceResponse.payload as ManoObra;
          await workforceValidation.updateWorkforce(
            item,
            responseProject.id,
            workforce.id
          );
        } else {
          const categoryResponse = await categoryWorkforceValidation.findByName(
            item.CATEGORIA,
            responseProject.id
          );
          const category = categoryResponse.payload as CategoriaObrero;
          const specialtyResponse =
            await specialtyWorkforceValidation.findByName(
              item.ESPECIALIDAD,
              responseProject.id
            );
          const specialty = specialtyResponse.payload as EspecialidadObrero;
          const unitResponse = await unitValidation.findBySymbol(
            "HH",
            responseProject.id
          );
          const unit = unitResponse.payload as Unidad;

          const lastWorkforce = await workforceValidation.codeMoreHigh(
            project_id
          );
          const lastWorkforceResponse = lastWorkforce.payload as ManoObra;

          // Incrementar el código en 1
          const nextCodigo = (parseInt(lastWorkforceResponse?.codigo) || 0) + 1;

          const formattedCodigo = nextCodigo.toString().padStart(3, "0");
          const excelEpoch = new Date(1899, 11, 30);
          let inicioDate;
          if (item.INGRESO) {
            inicioDate = new Date(
              excelEpoch.getTime() + item.INGRESO * 86400000
            );
            inicioDate.setUTCHours(0, 0, 0, 0);
          }
          let endDate;
          if (item.CESE) {
            endDate = new Date(excelEpoch.getTime() + item.CESE * 86400000);
            endDate.setUTCHours(0, 0, 0, 0);
          }

          let estado;
          if (item.ESTADO.toUpperCase() == E_Estado_MO_BD.ACTIVO) {
            estado = E_Estado_MO_BD.ACTIVO;
          } else {
            estado = E_Estado_MO_BD.INACTIVO;
          }
          await prisma.manoObra.create({
            data: {
              codigo: formattedCodigo,
              documento_identidad: item.DNI.toString(),
              contrasena: item.DNI.toString(),
              nombre_completo: item.NOMBRES,
              apellido_materno: item["APELLIDO MATERNO"],
              apellido_paterno: item["APELLIDO PATERNO"],
              genero: item.GENERO,
              estado_civil: item["ESTADO CIVIL"],
              categoria_obrero_id: category.id,
              especialidad_obrero_id: specialty.id,
              unidad_id: unit.id,
              fecha_inicio: item.INGRESO ? inicioDate : null,
              fecha_cese: item.CESE ? endDate : null,
              estado: estado,
              telefono: String(item.CELULAR),
              email_personal: item.CORREO,
              proyecto_id: responseProject.id,
              direccion: item.DIRECCION,
              lugar_nacimiento: item["LUGAR DE NACIMIENTO"],
            },
          });
        }
      }

      await prisma.$disconnect();

      return httpResponse.SuccessResponse("Empleados creados correctamente!");
    } catch (error) {
      await prisma.$disconnect();
      return httpResponse.InternalServerErrorException(
        "Error al leer la Mano de Obra",
        error
      );
    }
  }
  async findAll(data: T_FindAllWorkforce, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaWorkforceRepository.findAll(
        skip,
        data,
        +project_id
      );

      const { workforces, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: workforces,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer toda la Mano de Obra",
        formData
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al traer toda la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateStatusWorkforce(workforce_id: number): Promise<T_HttpResponse> {
    try {
      const workforceResponse = await workforceValidation.findById(
        workforce_id
      );
      if (!workforceResponse.success) {
        return workforceResponse;
      } else {
        const result = await prismaWorkforceRepository.updateStatusWorkforce(
          workforce_id
        );
        return httpResponse.SuccessResponse(
          "Mano de Obra eliminado correctamente",
          result
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error en eliminar la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const workforceService = new WorkforceService();

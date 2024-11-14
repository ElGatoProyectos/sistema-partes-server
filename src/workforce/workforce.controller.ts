import express from "../config/express.config";
import multer from "multer";
import { workforceService } from "./workforce.service";
import { T_FindAllWorkforce } from "./models/workforce.types";
import { I_UpdateWorkforceBody } from "./models/workforce.interface";
import * as ExcelJS from "exceljs";
import prisma from "../config/prisma.config";
const storage = multer.memoryStorage();
const upload: any = multer({ storage: storage });

class WorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateWorkforceBody;
    const project_id = request.get("project-id") as string;
    const result = await workforceService.createWorkforce(data, +project_id);

    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateWorkforceBody;
    const workforce_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const result = await workforceService.updateWorkforce(
      data,
      workforce_id,
      +project_id
    );

    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  workforceReadExcel = async (
    request: express.Request,
    response: express.Response
  ) => {
    // Usando multer para manejar la subida de archivos en memoria
    upload.single("workforce-file")(request, response, async (err: any) => {
      if (err) {
        return response.status(500).json({ error: "Error al leer el archivo" });
      }
      // const project_id = Number(request.params.project_id);

      const project_id = request.get("project-id") as string;
      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No se subió archivo" });
      }

      try {
        const serviceResponse = await workforceService.registerWorkforceMasive(
          file,
          +project_id
        );

        response.status(serviceResponse.statusCode).json(serviceResponse);
      } catch (error) {
        response.status(500).json(error);
      }
    });
  };
  async allWorkforce(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const search = request.query.search as string;
    const state = request.query.state as string;
    const category = request.query.category as string;
    const origin = request.query.origin as string;
    const speciality = request.query.specialty as string;
    const type = request.query.type as string;
    let paginationOptions: T_FindAllWorkforce = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
        state: state,
        category: category,
        origin: origin,
        specialty: speciality,
        type: type,
      },
    };
    const result = await workforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }

  async delete(request: express.Request, response: express.Response) {
    const workforce_id = Number(request.params.id);
    const result = await workforceService.updateStatusWorkforce(workforce_id);
    response.status(result.statusCode).json(result);
  }
  async changeStatus(request: express.Request, response: express.Response) {
    const workforce_id = Number(request.params.id);
    const result = await workforceService.changeStateWorkforce(workforce_id);
    response.status(result.statusCode).json(result);
  }
  async exportExcel(request: express.Request, response: express.Response) {
    const data = await prisma.manoObra.findMany({
      include: {
        TipoObrero: true,
        CategoriaObrero: true,
        OrigenObrero: true,
        EspecialidadObra: true,
      },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TestExportXLS");
    worksheet.columns = [
      { header: "DNI", key: "documento_identidad", width: 15 },
      { header: "NOMBRES", key: "nombre_completo", width: 30 },
      { header: "APELLIDO MATERNO", key: "apellido_materno", width: 30 },
      { header: "APELLIDO PATERNO", key: "apellido_paterno", width: 30 },
      { header: "TIPO", key: "tipo_obrero", width: 20 },
      { header: "ORIGEN", key: "origen_obrero", width: 20 },
      { header: "GENERO", key: "genero", width: 20 },
      { header: "ESTADO CIVIL", key: "estado_civil", width: 15 },
      { header: "CATEGORIA", key: "categoria_obrero", width: 20 },
      { header: "ESPECIALIDAD", key: "especialidad_obra", width: 20 },
      { header: "INGRESO", key: "fecha_inicio", width: 15 },
      { header: "CESE", key: "fecha_cese", width: 15 },
      { header: "ESTADO", key: "estado", width: 15 },
      { header: "CELULAR", key: "telefono", width: 15 },
      { header: "DIRECCION", key: "direccion", width: 30 },
      { header: "LUGAR DE NACIMIENTO", key: "lugar_nacimiento", width: 30 },
      { header: "CORREO", key: "correo", width: 30 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "244062" },
      };
      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },
      };
    });
    data.forEach((user) => {
      const row = worksheet.addRow({
        documento_identidad: user.documento_identidad,
        nombre_completo: user.nombre_completo,
        apellido_materno: user.apellido_materno,
        apellido_paterno: user.apellido_paterno,
        tipo_obrero: user.TipoObrero ? user.TipoObrero.nombre : "",
        origen_obrero: user.OrigenObrero ? user.OrigenObrero.nombre : "",
        genero: user.genero,
        estado_civil: user.estado_civil,
        categoria_obrero: user.CategoriaObrero
          ? user.CategoriaObrero.nombre
          : "",
        especialidad_obra: user.EspecialidadObra
          ? user.EspecialidadObra.nombre
          : "",
        fecha_inicio: user.fecha_inicio,
        fecha_cese: user.fecha_cese,
        estado: user.estado,
        telefono: user.telefono,
        direccion: user.direccion,
        lugar_nacimiento: user.lugar_nacimiento,
        correo: user.email_personal,
      });
      row.getCell("documento_identidad").numFmt = "@";
      row.getCell("fecha_inicio").numFmt = "dd/mm/yyyy";
      row.getCell("fecha_cese").numFmt = "dd/mm/yyyy";
    });
    const buffer = await workbook.xlsx.writeBuffer();
    response
      .header("Content-Disposition", "attachment; filename=manoDeObra.xlsx")
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .end(buffer);
  }
}

export const workforceController = new WorkforceController();

import { DetalleParteDiarioFoto, E_Estado_BD, Proyecto } from "@prisma/client";
import { I_ParteDiarioPdf } from "../../src/dailyPart/models/dailyPart.interface";
import appRootPath from "app-root-path";
import { ProjectMulterProperties } from "../../src/project/models/project.constant";
import path from "path";
import fs from "fs";
import { I_DailyPartDepartureForId } from "../../src/dailyPart/dailyPartDeparture/models/dailyPartDeparture.interface";
import { DailyPartPdf } from "../../src/dailyPart/dailyPartMO/models/dailyPartMO.interface";
import { I_DailyPartResourceForPdf } from "../../src/dailyPart/dailyPartResources/models/dailyPartResources.interface";
export function TemplateHtmlInformeParteDiario(
  daily_part_id: number,
  project: Proyecto,
  dailyPart: I_ParteDiarioPdf,
  details: I_DailyPartDepartureForId[],
  dailyPartMOFind: DailyPartPdf[],
  daillyPartResourceMaterials: I_DailyPartResourceForPdf[],
  daillyPartResourceTeams: I_DailyPartResourceForPdf[],
  daillyPartResourceSubcontractors: I_DailyPartResourceForPdf[],
  detailComments: DetalleParteDiarioFoto[]
) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  const dayWeek = date.getDay();
  const flag = dayWeek >= 1 && dayWeek <= 5;
  const valueIsBetweenWeek = 8.5;
  const valueIsEndWeek = 5.5;
  const valueToday = flag == true ? valueIsBetweenWeek : valueIsEndWeek;
  const imagePathProject = path.join(
    appRootPath.path,
    "static",
    ProjectMulterProperties.folder,
    ProjectMulterProperties.folder + "_" + project.id + ".png"
  );
  const base64ImageProject = fs
    .readFileSync(imagePathProject)
    .toString("base64");
  const base64TypeProject = `data:image/png;base64,${base64ImageProject}`;
  const valuesAssists: { [key: number]: String } = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miécoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
  };
  const resultDay = valuesAssists[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const startTime =
    dailyPart.hora_inicio === null ? "-" : dailyPart.hora_inicio;
  const startEnd = dailyPart.hora_fin === null ? "-" : dailyPart.hora_fin;
  const distancing = dailyPart.distanciamiento === null ? "" : "X";
  const protocolInit = dailyPart.protocolo_ingreso === null ? "" : "X";
  const protocolEnd = dailyPart.protocolo_salida === null ? "" : "X";
  const tableDailyPartDeparture = details
    .map((detail: I_DailyPartDepartureForId) => {
      return `
        <tr>
          <td colspan="1">${detail.item}</td>
          <td colspan="4">${detail.partida}</td>
          <td colspan="3">${detail.unidad}</td>
          <td colspan="2">${detail.cantidad_programada}</td>
          <td colspan="4">${detail.cantidad_utilizada}</td>
        </tr>
      `;
    })
    .join("");
  const tableDailyPartWorkforce = dailyPartMOFind.map(
    (detail: DailyPartPdf) => {
      return `
        <tr>
          <td >${detail.documento_identidad}</td>
          <td colspan="4">${detail.nombre_completo}</td>
          <td colspan="2">${detail.categoria_obrero}</td>
          <td colspan="2" >${detail.unidad}</td>
          <td>${detail.horas_trabajadas}</td>
          <td colspan="1">${detail.hora_normal}</td>
          <td colspan="1">${detail.hora_60}</td>
          <td colspan="2">${detail.hora_100}</td>
        </tr>
      `;
    }
  );
  const tableDailyPartResourceMaterials = daillyPartResourceMaterials
    .map((detail: I_DailyPartResourceForPdf) => {
      return `
        <tr>
          <td >${
            detail.Recurso.IndiceUnificado.codigo + detail.Recurso.codigo
          }</td>
          <td colspan="4">${detail.Recurso.nombre}</td>
          <td colspan="5">${detail.Recurso.Unidad.simbolo}</td>
          <td colspan="5" >${detail.cantidad}</td>
        </tr>
      `;
    })
    .join("");
  const tableDailyPartResourceTeams = daillyPartResourceTeams
    .map((detail: I_DailyPartResourceForPdf) => {
      return `
        <tr>
          <td >${
            detail.Recurso.IndiceUnificado.codigo + detail.Recurso.codigo
          }</td>
          <td colspan="4">${detail.Recurso.nombre}</td>
          <td colspan="5">${detail.Recurso.Unidad.simbolo}</td>
          <td colspan="5" >${detail.cantidad}</td>
        </tr>
      `;
    })
    .join("");
  const tableDailyPartResourceSubcontractors = daillyPartResourceSubcontractors
    .map((detail: I_DailyPartResourceForPdf) => {
      return `
        <tr>
          <td >${
            detail.Recurso.IndiceUnificado.codigo + detail.Recurso.codigo
          }</td>
          <td colspan="4">${detail.Recurso.nombre}</td>
          <td colspan="5">${detail.Recurso.Unidad.simbolo}</td>
          <td colspan="5" >${detail.cantidad}</td>
        </tr>
      `;
    })
    .join("");
  const tableComments = detailComments
    .map((detail: DetalleParteDiarioFoto) => {
      return `
        <tr>
          <td >${detail.comentario_uno}</td>
        </tr>
        <tr>
          <td >${detail.comentario_dos}</td>
        </tr>
        <tr>
          <td >${detail.comentario_tres}</td>
        </tr>
        <tr>
          <td >${detail.comentario_cuatro}</td>
        </tr>
      `;
    })
    .join("");
  let direction = path.join(appRootPath.path, "static", "dailyPartPhotos");
  const files = [
    `${daily_part_id}_photo_1.png`,
    `${daily_part_id}_photo_2.png`,
    `${daily_part_id}_photo_3.png`,
    `${daily_part_id}_photo_4.png`,
  ];
  // ///imagen 1
  // const imagePath1 = path.join(direction, file1);
  // const base64Image1 = fs.readFileSync(imagePath1).toString("base64");
  // const base64Type1= `data:image/png;base64,${base64Image1}`;
  // ///imagen 2
  // const imagePath2 = path.join(direction, file2);
  // const base64Image2 = fs.readFileSync(imagePath2).toString("base64");
  // const base64Type2= `data:image/png;base64,${base64Image2}`;
  // ///imagen 3
  // const imagePath3 = path.join(direction, file3);
  // const base64Image3 = fs.readFileSync(imagePath3).toString("base64");
  // const base64Type3= `data:image/png;base64,${base64Image3}`;
  // ///imagen 4
  // const imagePath4 = path.join(direction, file4);
  // const base64Image4 = fs.readFileSync(imagePath4).toString("base64");
  // const base64Type4= `data:image/png;base64,${base64Image4}`;
  function getBase64Image(filePath: string): string | null {
    try {
      const base64Image = fs.readFileSync(filePath).toString("base64");
      return `data:image/png;base64,${base64Image}`;
    } catch (err:any) {
      // console.error(`No se pudo leer el archivo: ${filePath}`, err.message);
      return null; // Retorna null si el archivo no existe
    }
  }

  const base64Images = files
  .map((file) => {
      const imagePath = path.join(direction, file);
      return getBase64Image(imagePath); // Retorna base64 si existe, o null si no
  })
  .filter((image): image is string => image !== null); // Asegura que el tipo sea solo string

const renderImages = (images: string[]) => {
  let rows = '';
  for (let i = 0; i < images.length; i += 2) {
      rows += `
          <tr>
              <td>
                  <img width="300" src="${images[i]}" alt="imagen ${i + 1}" />
              </td>
              ${
                  images[i + 1]
                      ? `<td><img width="300" src="${images[i + 1]}" alt="imagen ${i + 2}" /></td>`
                      : ''
              }
          </tr>
      `;
  }
  return rows;
};

const tablePhoto = `
  <table border="1" class="table text-base" cellpadding="8" cellspacing="0">
      ${renderImages(base64Images)}
  </table>
`;
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .content_general {
        padding: 2rem;
        font-family: sans-serif;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
      }

      /* td {
        font-size: 14px;
      } */
      .text-xl {
        font-size: 14px;
      }
      .text-base {
        font-size: 12px;
      }

      .table_header_color {
        background-color: #156082;
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="content_general">
      <table class="table" border="1">
        <tr>
          <td rowspan="2">
            <img
              width="50"
              heigth="20"
              src=${base64TypeProject}
              alt=""
            />
          </td>
          <td rowspan="2"><strong>PARTE DIARIO DE PRODUCCION</strong></td>
          <td>${resultDay}</td>
        </tr>
        <tr>
          <td><strong>${day}/${month}/${year}</strong></td>
        </tr>
      </table>
      <br />
      <table class="table text-base" border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td style="min-width: 120px">PROYECTO</td>
          <td colspan="9">
           ${project.nombre_completo}
          </td>
        </tr>
        <tr>
          <td>TREN</td>
          <td>${dailyPart.Trabajo.Tren.codigo}</td>
          <td colspan="4">${dailyPart.Trabajo.Tren.nombre}</td>
          <td rowspan="2" style="background-color: black; color: white">
            P-${dailyPart.codigo}
          </td>
          <td>Distanciamiento</td>
          <td colspan="2">${distancing}</td>
        </tr>
        <tr>
          <td>TRABAJO</td>
          <td>${dailyPart.Trabajo.codigo}</td>
          <td colspan="4">${dailyPart.Trabajo.nombre}</td>
           <td>Protocolo de ingreso</td>
           <td colspan="2">${protocolInit}</td>
        </tr>
        <tr>
          <td>ACTIVIDAD</td>
          <td colspan="4" style="background-color: #88df9e">
           ${
             dailyPart.descripcion_actividad
               ? dailyPart.descripcion_actividad
               : ""
           }
          </td>
          <td colspan="2"><strong>Horario</strong></td>
          <td>Protocolo de salida</td>
          <td colspan="2">${protocolEnd}</td>
        </tr>
        <tr>
          <td>SECTOR</td>
          <td colspan="4">${dailyPart.Trabajo.UnidadProduccion.nombre}</td>
          <td>Inicia</td>
          <td>Termina</td>
          <td colspan="3" rowspan="2" style="background-color: #88df9e">
            ${dailyPart.etapa}
          </td>
        </tr>
        <tr>
          <td>JORNADA</td>
          <td colspan="2">Horas Prog. ${valueToday}</td>
          <td colspan="2">${dailyPart.jornada ? dailyPart.jornada : ""}</td>
          <td><strong>${startTime}</strong></td>
          <td><strong>${startEnd}</strong></td>
        </tr>
      </table>

      <br />
      <br />

      <table class="table text-base" border="1" cellpadding="8" cellspacing="0">
        <tr style="background-color: black; color: white">
          <td colspan="1">ITEM</td>
          <td colspan="4">PARTIDAS / RECURSOS / NOMBRES</td>
          <td colspan="3">Und</td>
          <td colspan="2">Can. Progra.</td>
          <td colspan="4">Cantidad Ejecutada</td>
        </tr>

        <tr>
          <td colspan="30"></td>
        </tr>

        <!-- partidas -->

        <tr style="background-color: black; color: white">
          <td colspan="30" align="left">Partidas</td>
        </tr>
        <tr>
        ${tableDailyPartDeparture}
        </tr>
       

        <tr>
          <td colspan="30"></td>
        </tr>
        <!-- mano de obra -->

        <tr style="background-color: aqua">
          <td colspan="10" align="left">Mano de obra</td>
          <td >H.N</td>
          <td >Al 60%</td>
          <td colspan="2">Al 100%</td>
        </tr>
        <tr>
          ${tableDailyPartWorkforce}
        </tr>
      

        <tr>
          <td colspan="15"></td>
        </tr>
        <!-- materiales -->

        <tr style="background-color: cadetblue">
          <td colspan="15" align="left">Materiales</td>
        </tr>

        ${tableDailyPartResourceMaterials}
        <tr>
          <td colspan="15"></td>
        </tr>
        <!-- equipos -->

        <tr style="background-color: #88df9e">
          <td colspan="15" align="left">Equipos</td>
        </tr>

        ${tableDailyPartResourceTeams}

        <tr>
          <td colspan="15"></td>
        </tr>
        <!-- subcontratas -->

        <tr style="background-color: #f39191">
          <td colspan="15" align="left">Sub contratos</td>
        </tr>

        ${tableDailyPartResourceSubcontractors}
      </table>
      <br />
      <table class="table text-base" cellpadding="8" cellspacing="0">
        <tr>
          <td align="left">
            <strong>Comentarios de actividad del dia</strong>
          </td>
        </tr>
      </table>
      <table border="1" class="table text-base" cellpadding="8" cellspacing="0">
          ${tableComments}
      </table>
      <br />
      <table border="1" class="table text-base" cellpadding="8" cellspacing="0">
        <tr style="background-color: gray; color: white">
          <td><strong>PANEL FOTOGRAFICO</strong></td>
        </tr>
      </table>
      <br />
      ${tablePhoto}
      </table>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <table class="table text-base" cellpadding="8" cellspacing="0">
        <tr>
          <td align="center">
            <div>...............................................</div>
            <div>Ing. de Produccion</div>
          </td>
          <td align="center">
            <div>...............................................</div>
            <div>Ing. de Costos</div>
          </td>
          <td align="center">
            <div>...............................................</div>
            <div>Ing. Residente</div>
          </td>
        </tr>

        <tr></tr>
      </table>
    </div>
  </body>
</html>
`;
}

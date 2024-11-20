import {
  DetallePrecioHoraMO,
  ParteDiario,
  ParteDiarioPartida,
  PrecioHoraMO,
  Proyecto,
} from "@prisma/client";
import path from "path";
import fs from "fs";
import appRootPath from "app-root-path";
import { ProjectMulterProperties } from "../../src/project/models/project.constant";
import {
  I_DailyPart,
  I_ParteDiario,
} from "../../src/dailyPart/models/dailyPart.interface";
import { I_DepartureJobForPdf } from "../../src/departure/departure-job/models/departureJob.interface";
import { I_DailyPartDepartureForPdf } from "../../src/dailyPart/dailyPartDeparture/models/dailyPartDeparture.interface";

export const TemplateHtmlInforme = async (
  user_id: number,
  project: Proyecto,
  daily_parts: I_ParteDiario[],
  detailsDepartureJob: I_DepartureJobForPdf[],
  dailysPartsDeparture: I_DailyPartDepartureForPdf[],
  workforces: any[],
  restrictions: I_ParteDiario[],
  date: Date,
  productionForDay: number,
  totalProductionWorkforce: number,
  totalRealWorkforceProduction: number,
  desviacion: number
) => {
  console.log("esta dentro");
  const imagePath = path.join(
    appRootPath.path,
    "static",
    "charts",
    `chart-${user_id}.png`
  );
  const base64Image = fs.readFileSync(imagePath).toString("base64");
  const base64Type = `data:image/png;base64,${base64Image}`;

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
  const dailyPartsToday = daily_parts
    .map((detail) => {
      return `
        <tr>
          <td>${detail.Trabajo.codigo || "N/A"}</td>
          <td>${detail.Trabajo?.nombre || "N/A"}</td>
          <td>${detail.descripcion_actividad || "N/A"}</td>
         <td>${detail.Trabajo?.UnidadProduccion.nombre || "N/A"}</td>
         
        </tr>
      `;
    })
    .join("");
  console.log("paso partes diario");
  const detailsForJob = detailsDepartureJob
    .map((detail) => {
      return `
        <tr>
          <td>${detail.Trabajo?.codigo || "N/A"}</td>
          <td>${detail.Trabajo?.nombre || "N/A"}</td>
          <td>${detail.Trabajo?.costo_partida || "N/A"}</td>
          <td>${detail.Trabajo?.UnidadProduccion.nombre || "N/A"}</td>
        </tr>
      `;
    })
    .join("");
  console.log("paso detalle trabajo partida");
  const tableRowsDetailsDepartures = dailysPartsDeparture
    .map((detail) => {
      return `
        <tr>
          <td>${detail.Partida?.item || "N/A"}</td>
          <td>${detail.Partida?.partida || "N/A"}</td>
          <td>${detail.Partida?.Unidad?.simbolo || "N/A"}</td>
          <td>${detail.cantidad_utilizada || "N/A"}</td>
          <td>$${detail.Partida.precio || "N/A"}</td>
          <td>$${detail.Partida.parcial || "N/A"}</td>
        </tr>
      `;
    })
    .join("");
  console.log("paso parte diario partida");
  console.log(workforces);
  const tablaWorkfoces = workforces
    .map((detail: any) => {
      return `
        <tr>
          <td>${detail.codigo}</td>
          <td>${detail.dni}</td>
          <td>${detail.nombre_completo}</td>
          <td>${detail.hora_normal}</td>
          <td>$${detail.hora_60}</td>
          <td>$${detail.hora_100}</td>
          <td>$${detail.costo_diario}</td>
        </tr>
      `;
    })
    .join("");
  console.log("paso mano de obra");

  const restrictionsToTheDay = restrictions
    .map((detail: any) => {
      return `
        <tr>
          <td>${detail.Trabajo.codigo}</td>
          <td>${detail.Trabajo.nombre}</td>
          <td>${detail.descripcion}</td>
          <td>${detail.estado}</td>
          <td>$${detail.riesgo}</td>
        </tr>
      `;
    })
    .join("");
  console.log("paso restricciones");

  // let direction = path.join(appRootPath.path, "static", "daiyPartPhotos");
  // let numbersPhotos = [1, 2, 3, 4];

  // const files = await fs.promises.readdir(direction);

  // const counts: Record<string, number> = {};

  // files.forEach((file) => {
  //   const match = file.match(/^(\d+)_photo_(\d+)/);
  //   if (match) {
  //     const [_, prefix, suffix] = match; // Obtiene el número antes y después de 'photo'
  //     const prefixNumber = parseInt(prefix, 10);
  //     const suffixNumber = parseInt(suffix, 10);

  //     // Verifica si ambos números están en sus respectivos arrays
  //     if (
  //       idsDailyPart.includes(prefixNumber) &&
  //       numbersPhotos.includes(suffixNumber)
  //     ) {
  //       const key = `${prefix}_photo_${suffix}`;
  //       counts[key] = (counts[key] || 0) + 1;
  //     }
  //   }
  // });
  console.log("llego al final");

  const valuesAssists: { [key: number]: String } = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miécoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
  };
  const resultValue = valuesAssists[date.getDay()];
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return `
  
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      table, tr, td, th {
        page-break-inside: avoid;
      }

      .content_general {
        padding: 2rem;
        font-family: sans-serif;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
      }

      td {
        font-size: 14px;
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
            <img width="200" src="${base64TypeProject}" alt="Chart Image" />
          </td>
          <td><strong>INFORME DE PRODUCCIÓN</strong></td>
          <td><strong>Fecha</strong></td>
        </tr>
        <tr>
          <td>
            ${project.nombre_completo}
          </td>
          <td>${resultValue} ${day}/${month}/${year}</td>
        </tr>
      </table>
    <br />
      <br />

     
      <!-- section 1 -->

      <table>
        <tr>
          <td colspan="4" align="left">
            <strong> I). Trabajo y Actividades el 25/08/2024: </strong>
          </td>
        </tr>
      </table>
      <table class="table" border="1" cellpadding="4">
        <tr class="table_header_color">
          <td><span>ID TRABAJO</span></td>
          <td><span>TRABAJO</span></td>
          <td><span>ACTIVIDADES</span></td>
          <td><span>UNIDAD DE PRODUCCIÓN</span></td>
        </tr>
         ${dailyPartsToday}
      </table>

      <br />
      <br />

      <!-- section 2 -->

      <table>
        <tr>
          <td colspan="4" align="left">
            <strong> II). Trabajo y Costo De Producción 25/08/2024: </strong>
          </td>
        </tr>
      </table>
      <table class="table" border="1" cellpadding="4">
        <tr class="table_header_color">
          <td><span>ID TRABAJO</span></td>
          <td><span>TRABAJO</span></td>
          <td><span>COSTO DE PRODUCCION</span></td>
          <td><span>UNIDAD DE PRODUCCION</span></td>
        </tr>
         ${detailsForJob}
      </table>
      <br />
      <br />

      <!-- section 3 -->

      <table>
        <tr>
          <td colspan="4" align="left">
            <strong> III). Partidas Del Dia: </strong>
          </td>
        </tr>
      </table>
      <table class="table" border="1" cellpadding="4">
        <tr class="table_header_color">
          <td><span>ITEM</span></td>
          <td><span>PARTIDA</span></td>
          <td><span>UNIDAD</span></td>
          <td><span>METRAD EJECUTADO</span></td>
          <td><span>COSTO UNITARIO</span></td>
          <td><span>PARCIAL</span></td>
        </tr>
       ${tableRowsDetailsDepartures}
      </table>

      <br />
      <br />

      <!-- section 4 -->

      <table>
        <tr>
          <td colspan="4" align="left">
            <strong> IV). Personal En El Dia: </strong>
          </td>
        </tr>
      </table>
      <table class="table" border="1" cellpadding="4">
        <tr class="table_header_color">
          <td><span>ID</span></td>
          <td><span>DNI</span></td>
          <td><span>NOMBRE COMPLETO</span></td>
          <td><span>H.N.</span></td>
          <td><span>HORA EXTRA 60%</span></td>
          <td><span>HORA EXTRA 100%</span></td>
          <td><span>COSTO DIARIO</span></td>
        </tr>
        ${tablaWorkfoces}
      </table>
      <br />
      <br />
      <!-- section 5 -->

      <table>
        <tr>
          <td colspan="4" align="left">
            <strong> V). Producción Del Dia: </strong>
          </td>
        </tr>
      </table>
      <table class="table" border="1" cellpadding="4" >
        <tr class="table_header_color">
          <td><span>Producción Del Dia</span></td>
          <td><span>Mano De Obra Para La
            Producción Realizada</span></td>
          <td><span>Mano De Obra Real En El
            Dia</span></td>
          <td><span>Desviación</span></td>
        </tr>
        <tr>
          <td>S/. ${productionForDay}</td>
          <td>S/. ${totalProductionWorkforce}</td>
          <td>S/. ${totalRealWorkforceProduction}</td>
           ${formatCurrency(desviacion)}
        </tr>
      </table>

      <br />
      <br />
      <!-- section 5 -->

      <table>
        <tr>
          <td colspan="4" align="left">
            <strong> VI). Restricciones Del Dia: </strong>
          </td>
        </tr>
      </table>
      <table class="table" border="1" cellpadding="4" >
        <tr class="table_header_color">
          <td><span>ID
            TRABAJO</span></td>
          <td><span>TRABAJO</span></td>
          <td><span>DESCRIPCION RESTRICCION</span></td>
          <td><span>ESTADO</span></td>
          <td><span>GRADO DE
            RIESGO</span></td>

        </tr>
         ${restrictionsToTheDay}
      </table>




      <br />
      <br />
      <!-- section 5 -->

      <table  >
        <tr>
          <td colspan="4" align="left">
            <strong> VII). Panel Fotográfico: </strong>
          </td>
        </tr>
      </table>
      <table class="table" border >
        <tr>
          <td align="left">Foto 01: Colocación Acero</td>
          <td align="left">Foto 02: Colocación Acero</td>
        </tr>
        <tr>
          <td style="height: 200px;"></td>
          <td></td>

        </tr>
        <tr>
          <td align="left">Foto 03: Colocación Acero</td>
          <td align="left">Foto 04: Colocación Acero</td>
        </tr>
        <tr>
          <td style="height: 200px;"></td>
          <td></td>

        </tr>
      </table>

      <table>
        <tr>
          <td>
              <img src="${base64Type}" alt="Chart Image" />
          
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>

  
  `;
};

export const TemplateHtmlInforme_Header = () => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .content_general {
        padding: 4rem;
        font-family: sans-serif;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
      }

      td {
        font-size: 14px;
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
              width="200"
              height="300"
              src="https://imagenes.elpais.com/resizer/v2/Y3W6QUFBBZLLTALRW6NBRPZ2RA.jpg?auth=d68f18251117888479d8fdc3210796bc86d9d3f41719da72c2877bcafc3504ea&width=1960&height=1103&smart=true"
              alt=""
            />
          </td>
          <td><strong>INFORME DE PRODUCCIÓN</strong></td>
          <td><strong>Fecha</strong></td>
        </tr>
        <tr>
          <td>
            Obra: Saldo de obra mejoramiento del servicio de educación inicial
            en la I.E. villa continental, distrito de Cayma-provincia de
            Cayma-Región Arequipa.
          </td>
          <td>Lunes 19/08/2024</td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;
};

function formatCurrency(value: number): string {
  const formattedValue = `S/. ${value.toFixed(2)}`;
  return value < 0
    ? `<td style="color:red">${formattedValue}</td>`
    : `<td>${formattedValue}</td>`;
}

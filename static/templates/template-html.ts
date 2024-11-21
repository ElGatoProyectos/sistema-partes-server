import { DetalleParteDiarioFoto, Proyecto } from "@prisma/client";
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
  desviacion: number,
  idsDailyPart: number[],
  dailyPartComentary: DetalleParteDiarioFoto[]
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
          <td>S/. ${formatNumberToDecimal(
            detail.Trabajo?.costo_partida || 0
          )}</td>
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
          <td>${detail.cantidad_utilizada || 0}</td>
          <td>S/. ${formatNumberToDecimal(detail.Partida.precio || 0)}</td>
          <td>S/. ${formatNumberToDecimal(detail.Partida.parcial || 0)}</td>
        </tr>
      `;
    })
    .join("");
  console.log("paso parte diario partida");
  const tablaWorkfoces = workforces
    .map((detail: any) => {
      return `
        <tr>
          <td>${detail.codigo}</td>
          <td>${detail.dni}</td>
          <td>${detail.nombre_completo}</td>
          <td>${detail.hora_normal}</td>
          <td>${detail.hora_60}</td>
          <td>${detail.hora_100}</td>
           <td>S/. ${formatNumberToDecimal(detail.costo_diario || 0)}</td>
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
          <td>${detail.RiesgoParteDiario?.descripcion || ""}</td>
          <td>${detail.RiesgoParteDiario?.estado || ""}</td>
          <td>${detail.RiesgoParteDiario?.riesgo || ""}</td>
        </tr>
      `;
    })
    .join("");
  console.log("paso restricciones");

  let direction = path.join(appRootPath.path, "static", "dailyPartPhotos");
  let numbersPhotos = [1, 2, 3, 4];
  let numbersPhotosOnlyOne = [1];
  let numbersPhotosOnlyTwo = [1, 2];

  const files = await fs.promises.readdir(direction);

  const counts: Record<string, number> = {};

  let idsDailyParts = [1, 2, 3];

  // //[note] acá diria si hay menos de 8
  if (idsDailyParts.length === 3) {
    files.forEach((file) => {
      const match = file.match(/^(\d+)_photo_(\d+)/);
      if (match) {
        const [_, prefix, suffix] = match; // Obtiene el número antes y después de 'photo'
        const prefixNumber = parseInt(prefix, 10);
        const suffixNumber = parseInt(suffix, 10);

        // Verifica si ambos números están en sus respectivos arrays
        if (
          idsDailyPart.includes(prefixNumber) &&
          numbersPhotos.includes(suffixNumber)
        ) {
          const key = `${prefix}_photo_${suffix}`;
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    });
  }

  //[note] aca diria si hay 8
  if (idsDailyParts.length === 4) {
    console.log("entro al solo es 1");
    files.forEach((file) => {
      const match = file.match(/^(\d+)_photo_(\d+)/);
      if (match) {
        const [_, prefix, suffix] = match; // Obtiene el número antes y después de 'photo'
        const prefixNumber = parseInt(prefix, 10);
        const suffixNumber = parseInt(suffix, 10);

        // Verifica si ambos números están en sus respectivos arrays
        if (
          idsDailyPart.includes(prefixNumber) &&
          numbersPhotosOnlyTwo.includes(suffixNumber)
        ) {
          const key = `${prefix}_photo_${suffix}`;
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    });
  }

  //[note] acá diria si hay más de 20
  if (idsDailyParts.length > 5) {
    console.log("entro al es mas 3 ");
    files.forEach((file) => {
      const match = file.match(/^(\d+)_photo_(\d+)/);
      if (match) {
        const [_, prefix, suffix] = match; // Obtiene el número antes y después de 'photo'
        const prefixNumber = parseInt(prefix, 10);
        const suffixNumber = parseInt(suffix, 10);

        // Verifica si ambos números están en sus respectivos arrays
        if (
          idsDailyPart.includes(prefixNumber) &&
          numbersPhotosOnlyOne.includes(suffixNumber)
        ) {
          const key = `${prefix}_photo_${suffix}`;
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    });
  }

  const photos = Object.keys(counts);
  const fotosConExtension = photos.map((photo) => `${photo}.png`);

  // const imagesHtml = files
  //   .filter((file) => file.match(/^(\d+)_photo_(\d+)/)) // Filtrar solo las fotos con el patrón correcto
  //   .map((file) => {
  //     const imagePath = path.join(direction, file);
  //     const base64Image = fs.readFileSync(imagePath).toString("base64");
  //     const base64Type = `data:image/png;base64,${base64Image}`;

  //     // Crear una etiqueta <img> para cada imagen
  //     return `<img src="${base64Type}" alt="${file}" style="width: 200px; height: auto; margin: 10px;" />`;
  //   })
  //   .join("");

  const getComentario = (photoName: string) => {
    const match = photoName.match(/^(\d+)_photo_(\d+)$/);
    if (!match) return null;

    const parteDiarioId = parseInt(match[1], 10); // Primer número
    const comentarioIndex = parseInt(match[2], 10); // Segundo número

    // Buscar el objeto correspondiente en el array de comentarios
    const parteDiario = dailyPartComentary.find(
      (item) => item.parte_diario_id === parteDiarioId
    );

    if (!parteDiario) return null; // No se encontró el parte diario

    // Devolver el comentario correspondiente según el índice
    switch (comentarioIndex) {
      case 1:
        return parteDiario.comentario_uno;
      case 2:
        return parteDiario.comentario_dos;
      case 3:
        return parteDiario.comentario_tres;
      case 4:
        return parteDiario.comentario_cuatro;
      default:
        return null; // Índice no válido
    }
  };

  const imagesHtml = `
  <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
    ${fotosConExtension
      .filter((file) => file.match(/^(\d+)_photo_(\d+)/))
      .map((file, index) => {
        const imagePath = path.join(direction, file);
        const base64Image = fs.readFileSync(imagePath).toString("base64");
        const base64Type = `data:image/png;base64,${base64Image}`;

        // Obtener el número de la foto
        const photoNumber = index + 1;

        // Eliminar la extensión del archivo para obtener solo el nombre (sin .png)
        const fileName = path.parse(file).name;

        // Obtener el comentario para la foto
        const comentario =
          getComentario(fileName) ||
          `Foto ${photoNumber}: Sin comentario disponible`;

        // Crear el HTML para cada celda de la tabla
        return `
          <td style="width: 50%; padding: 10px; text-align: center; border: 1px solid #ddd;">
            <p style="font-size: 14px; font-weight: bold; margin: 5px 0;">Foto ${photoNumber}: ${comentario}</p>
            <img src="${base64Type}" alt="${file}" style="width: 100%; height: 200px; object-fit: cover; border: 1px solid #ccc;" />
          </td>
        `;
      })
      .reduce((rows: string[], cellHtml, index) => {
        if (index % 2 === 0) {
          rows.push(
            `<tr><table style="width: 100%; border-collapse: collapse; table-layout: fixed;"><tr>${cellHtml}`
          );
        } else {
          rows[rows.length - 1] += `${cellHtml}</tr></table></tr>`;
        }
        return rows;
      }, [])
      .join("")}
  </table>
`;

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
  console.log("numero del dia " + date.getDay());
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
          <td>S/. ${formatNumberToDecimal(productionForDay || 0)}</td>
          <td>S/. ${formatNumberToDecimal(totalProductionWorkforce || 0)}</td>
          <td>S/. ${formatNumberToDecimal(
            totalRealWorkforceProduction || 0
          )}</td>
           <td>S/. ${formatNumberToDecimal(desviacion || 0)}</td>
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
      ${imagesHtml}
        
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

export function formatNumberToDecimal(number: number) {
  if (number === 0) {
    return "-";
  } else {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

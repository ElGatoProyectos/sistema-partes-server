import {
  DetallePrecioHoraMO,
  DetalleTrabajoPartida,
  ParteDiario,
  PrecioHoraMO,
  Proyecto,
} from "@prisma/client";
import path from "path";
import fs from "fs";
import appRootPath from "app-root-path";
import { ProjectMulterProperties } from "../../src/project/models/project.constant";
import prisma from "../../src/config/prisma.config";
import { dailyPartReportValidation } from "../../src/dailyPart/dailyPart.validation";
import {
  I_DailyPart,
  I_ParteDiario,
} from "../../src/dailyPart/models/dailyPart.interface";
import { priceHourWorkforceValidation } from "../../src/workforce/priceHourWorkforce/priceHourWorkforce.valdation";
import { detailPriceHourWorkforceValidation } from "../../src/workforce/detailPriceHourWorkforce/detailPriceHourWorkforce.validation";

export const TemplateHtmlInforme = async (
  user_id: number,
  project: Proyecto
) => {
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

  const dailyPartsResponse =
    await dailyPartReportValidation.findByDateAllDailyPart();

  const dailyParts = dailyPartsResponse.payload as I_ParteDiario[];

  const idsJob = dailyParts.map((dailyPart) => dailyPart.trabajo_id);
  const idsDailyPart = dailyParts.map((dailyPart) => dailyPart.id);

  const details = await prisma.detalleTrabajoPartida.findMany({
    where: {
      trabajo_id: {
        in: idsJob,
      },
    },
    include: {
      Trabajo: {
        include: {
          UnidadProduccion: true,
        },
      },
      Partida: {
        include: {
          Unidad: true,
        },
      },
    },
  });

  let productionForDay = 0;
  let totalProductionWorkforce = 0;
  if (details.length > 0) {
    details.map((detail) => {
      productionForDay += detail.metrado_utilizado * detail.Partida.precio;

      totalProductionWorkforce +=
        detail.metrado_utilizado * detail.Partida.mano_de_obra_unitaria;
    });
  }

  //[note] acá muestro los partes diarios del día
  const dailyPartsToday = dailyParts
    .map((detail) => {
      return `
        <tr>
          <td>${detail.Trabajo.codigo || "N/A"}</td>
          <td>${detail.Trabajo?.nombre || "N/A"}</td>
          <td>${detail.nombre || "N/A"}</td>
          <td>${detail.Trabajo?.UnidadProduccion.nombre || "N/A"}</td>
        </tr>
      `;
    })
    .join("");
  //[note] acá el monto trabajo
  const detailsForJob = details
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

  //[note] acá las partidas del día
  const detailsDailyPartDeparture = await prisma.parteDiarioPartida.findMany({
    where: {
      ParteDiario: {
        id: {
          in: idsDailyPart,
        },
      },
    },
    include: {
      Partida: {
        include: {
          Unidad: true,
        },
      },
    },
  });
  const tableRowsDetailsDepartures = detailsDailyPartDeparture
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

  //[note] buscamos el personal del día que esta en el Parte Diario
  const dailyPartWorkforce = await prisma.parteDiarioMO.findMany({
    where: {
      ParteDiario: {
        id: {
          in: idsDailyPart,
        },
      },
    },
    include: {
      ManoObra: {
        include: {
          CategoriaObrero: true,
        },
      },
    },
  });

  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  let workforces: any = [];
  const priceHourResponse = await priceHourWorkforceValidation.findByDate(date);
  let detailsPriceHourMO: DetallePrecioHoraMO[] = [];
  let totalRealWorkforceProduction = 0;
  if (priceHourResponse.success && dailyPartWorkforce.length > 0) {
    const priceHourMO = priceHourResponse.payload as PrecioHoraMO;
    const detailsPriceHourMOResponse =
      await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
        priceHourMO.id
      );
    detailsPriceHourMO =
      detailsPriceHourMOResponse.payload as DetallePrecioHoraMO[];
    dailyPartWorkforce.forEach((workforce) => {
      if (workforce.ManoObra.CategoriaObrero) {
        const categoriaId = workforce.ManoObra.CategoriaObrero.id;

        const detail = detailsPriceHourMO.find(
          (detail) => detail.categoria_obrero_id === categoriaId
        );

        if (
          detail &&
          workforce.hora_60 &&
          workforce.hora_100 &&
          workforce.hora_normal
        ) {
          let sumaCategoryMO = 0;
          totalProductionWorkforce +=
            detail.hora_normal * workforce.hora_normal +
            detail.hora_extra_60 * workforce.hora_60 +
            detail.hora_extra_100 * workforce.hora_100;
          sumaCategoryMO =
            detail.hora_normal * workforce.hora_normal +
            detail.hora_extra_60 * workforce.hora_60 +
            detail.hora_extra_100 * workforce.hora_100;
          //[note] si está todo bien vamos a hacer agregarlo
          workforces.push({
            codigo: workforce.ManoObra.codigo,
            dni: workforce.ManoObra.documento_identidad,
            nombre_completo:
              workforce.ManoObra.nombre_completo +
              workforce.ManoObra.apellido_materno +
              workforce.ManoObra.apellido_paterno,
            hora_normal: workforce.hora_normal,
            hora_60: workforce.hora_60,
            hora_100: workforce.hora_100,
            costo_diario: sumaCategoryMO,
          });
        }
      }
    });
  }

  if (!priceHourResponse.success && dailyPartWorkforce.length > 0) {
    //[note] esto lo hago por las dudas de que no haya cargado la tabla salarial o no haya una de acuerdo al día que lo imprime
    dailyPartWorkforce.forEach((workforce) => {
      workforces.push({
        codigo: workforce.ManoObra.codigo,
        dni: workforce.ManoObra.documento_identidad,
        nombre_completo:
          workforce.ManoObra.nombre_completo +
          workforce.ManoObra.apellido_materno +
          workforce.ManoObra.apellido_paterno,
        hora_normal: workforce.hora_normal,
        hora_60: workforce.hora_60,
        hora_100: workforce.hora_100,
        costo_diario: 0,
      });
    });
  }

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
            Obra: Saldo de obra mejoramiento del servicio de educación inicial
            en la I.E. villa continental, distrito de Cayma-provincia de
            Cayma-Región Arequipa.
          </td>
          <td>Lunes 19/08/2024</td>
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
          <td>S/. ${totalProductionWorkforce}</td>
           ${formatCurrency(totalProductionWorkforce)}
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
        <tr>
          <td>001</td>
          <td>Acero -Bloque A</td>
          <td>El Acero Llego en la tarde y personal estuvo parado. Por
            3 horas</td>
          <td>Solucionado</td>
          <td>Medio</td>
        </tr>
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

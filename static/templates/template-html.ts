import path from "path";
import fs from "fs";

export const TemplateHtmlInforme = (user_id: number, id: string) => {
  const imagePath = path.resolve(
    __dirname,
    "/static/charts/chart-" + user_id + "-" + id + ".png"
  );
  const base64Image = fs.readFileSync(imagePath).toString("base64");
  const base64Type = `data:image/png;base64,${base64Image}`;
  // <img src="${base64Type}" alt="Chart Image" />

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
            <img width="200" src="https://img.freepik.com/vector-premium/diseno-logotipo-minimalista-cualquier-empresa-negocios-marca-corporativa_1253202-77511.jpg?semt=ais_hybrid" alt="Chart Image" />
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
        <tr>
          <td>001</td>
          <td>Acero – Bloque A</td>
          <td>Colocación De Acero En Columnas</td>
          <td>Bloque A</td>
        </tr>
        <tr>
          <td>001</td>
          <td>Acero – Bloque A</td>
          <td>Colocación De Acero En Columnas</td>
          <td>Bloque A</td>
        </tr>
        <tr>
          <td>001</td>
          <td>Acero – Bloque A</td>
          <td>Colocación De Acero En Columnas</td>
          <td>Bloque A</td>
        </tr>
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
        <tr>
          <td>001</td>
          <td>Acero – Bloque A</td>
          <td>S/. 3500.00</td>
          <td>Bloque A</td>
        </tr>
        <tr>
          <td>001</td>
          <td>Acero – Bloque A</td>
          <td>S/. 3500.00</td>
          <td>Bloque A</td>
        </tr>
        <tr>
          <td>001</td>
          <td>Acero – Bloque A</td>
          <td>S/. 3500.00</td>
          <td>Bloque A</td>
        </tr>
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
        <tr>
          <td>01.01</td>
          <td>Acero En Columnas</td>
          <td>Kg</td>
          <td>800</td>
          <td>S/ 5.07</td>
          <td>S/. 4056.00</td>
        </tr>
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
        <tr>
          <td>01</td>
          <td>43429343</td>
          <td>Dionisio Alejandro Bravo Ardela</td>
          <td>8.5</td>
          <td>2.0</td>
          <td>1.0</td>
          <td>S/. 150.00</td>
        </tr>
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
          <td>S/. 2500.00</td>
          <td>S/. 800.00</td>
          <td>S/. 900.00</td>
          <td style="color:red"">S/. -100.00</td>
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

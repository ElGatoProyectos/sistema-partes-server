export function TemplateHtmlInformeParteDiario(user_id: number, id: string) {
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
              width="200"
              src="https://imagenes.elpais.com/resizer/v2/Y3W6QUFBBZLLTALRW6NBRPZ2RA.jpg?auth=d68f18251117888479d8fdc3210796bc86d9d3f41719da72c2877bcafc3504ea&width=1960&height=1103&smart=true"
              alt=""
            />
          </td>
          <td rowspan="2"><strong>PARTE DIARIO DE PRODUCCION</strong></td>
          <td>Viernes</td>
        </tr>
        <tr>
          <td><strong>19/08/2024</strong></td>
        </tr>
      </table>
      <br />
      <table class="table text-base" border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td style="min-width: 120px">PROYECTO</td>
          <td colspan="9">
            SALDO DE OBRA MEJORAMIENTO DEL SERVICIO DE EDUCACION INICIAL EN LA
            I.E. VILLA CONTINENTAL, DISTRITO DE CAYMA-PROVINCIA DE CAYMA-REGION
            AREQUIPA
          </td>
        </tr>
        <tr>
          <td>TREN</td>
          <td>Error</td>
          <td colspan="4">Error</td>
          <td rowspan="2" style="background-color: black; color: white">
            P-01
          </td>
          <td>Distanciamiento</td>
          <td colspan="2">x</td>
        </tr>
        <tr>
          <td>TRABAJO</td>
          <td>Error</td>
          <td colspan="4">Personal para mantener la paz social</td>
          <td>Protocolo de ingreso</td>
          <td colspan="2">x</td>
        </tr>
        <tr>
          <td>ACTIVIDAD</td>
          <td colspan="4" style="background-color: #88df9e">
            Personal que no produce
          </td>
          <td colspan="2"><strong>Horario</strong></td>
          <td>Protocolo de salida</td>
          <td colspan="2">x</td>
        </tr>
        <tr>
          <td>SECTOR</td>
          <td colspan="4">Error</td>
          <td>Inicia</td>
          <td>Termina</td>
          <td colspan="3" rowspan="2" style="background-color: #88df9e">
            Terminado
          </td>
        </tr>
        <tr>
          <td>JORNADA</td>
          <td colspan="2">Horas Prog. 8.5</td>
          <td colspan="2"></td>
          <td><strong>7:30</strong></td>
          <td><strong>8:30</strong></td>
        </tr>
      </table>

      <!-- data -->
      <br />
      <br />

      <table class="table text-base" border="1" cellpadding="8" cellspacing="0">
        <tr style="background-color: black; color: white">
          <td>ITEM</td>
          <td colspan="3">PARTIDAS / RECURSOS / NOMBRES</td>
          <td>Observacion</td>
          <td>Und</td>
          <td>Can. Progra.</td>
          <td colspan="3">Cantidad Ejecutada</td>
        </tr>

        <tr>
          <td colspan="10"></td>
        </tr>

        <!-- partidas -->

        <tr style="background-color: black; color: white">
          <td colspan="10" align="left">Partidas</td>
        </tr>
        <tr>
          <td>Error</td>
          <td colspan="3">Personal Para Mantener Paz Social</td>
          <td></td>
          <td></td>
          <td></td>
          <td colspan="3">0.10</td>
        </tr>
        <tr>
          <td>Error</td>
          <td colspan="3">Personal Para Mantener Paz Social</td>
          <td></td>
          <td></td>
          <td></td>
          <td colspan="3">0.10</td>
        </tr>
        <tr>
          <td>Error</td>
          <td colspan="3">Personal Para Mantener Paz Social</td>
          <td></td>
          <td></td>
          <td></td>
          <td colspan="3">0.10</td>
        </tr>

        <tr>
          <td colspan="10"></td>
        </tr>
        <!-- partidas -->

        <tr style="background-color: aqua">
          <td colspan="7" align="left">Mano de obra</td>
          <td>H.N</td>
          <td>Al 60%</td>
          <td>Al 100%</td>
        </tr>
        <tr>
          <td>23433234</td>
          <td colspan="3">Pepito jose romero</td>
          <td>Peon</td>
          <td>HH</td>
          <td>8.500</td>
          <td>0.10</td>
          <td>0.10</td>
          <td>0.10</td>
        </tr>
        <tr>
          <td>23433234</td>
          <td colspan="3">Pepito jose romero</td>
          <td>Peon</td>
          <td>HH</td>
          <td>8.500</td>
          <td>0.10</td>
          <td>0.10</td>
          <td>0.10</td>
        </tr>

        <tr>
          <td colspan="10"></td>
        </tr>
        <!-- partidas -->

        <tr style="background-color: cadetblue">
          <td colspan="10" align="left">Materiales</td>
        </tr>

        <tr>
          <td colspan="10"></td>
        </tr>
        <!-- equipos -->

        <tr style="background-color: #88df9e">
          <td colspan="10" align="left">Equipos</td>
        </tr>

        <tr>
          <td colspan="10"></td>
        </tr>
        <!-- equipos -->

        <tr style="background-color: #f39191">
          <td colspan="10" align="left">Sub contratos</td>
        </tr>
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
        <tr>
          <td align="left">
            PERSONAL QUE NO TRABAJO, HIZO BRAZOS CAIDOS POR TEMAS QUE NO TIENEN
            SUSTENTO
          </td>
        </tr>
      </table>
      <br />
      <table border="1" class="table text-base" cellpadding="8" cellspacing="0">
        <tr style="background-color: gray; color: white">
          <td><strong>PANEL FOTOGRAFICO</strong></td>
        </tr>
      </table>
      <br />
      <table border="1" class="table text-base" cellpadding="8" cellspacing="0">
        <tr>
          <td>
            <img
              width="300"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpHekuGgYptJloLl0HpVU93_ENdqXS0O_jmQ&s"
              alt=""
            />
          </td>
          <td>
            <img
              width="300"
              src="https://cdn.www.gob.pe/uploads/document/file/4472807/341533369_950519069629478_2537426049938018294_n.jpg"
              alt=""
            />
          </td>
        </tr>
        <tr>
          <td>
            <img
              width="300"
              src="https://cdn.www.gob.pe/uploads/document/file/4472808/340853005_122061470853082_2583673523473228015_n.jpg"
              alt=""
            />
          </td>
          <td>
            <img
              width="300"
              src="https://cdn.www.gob.pe/uploads/document/file/4472809/341624981_1246592289575992_8084085212387816745_n%20%281%29.jpg"
              alt=""
            />
          </td>
        </tr>
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

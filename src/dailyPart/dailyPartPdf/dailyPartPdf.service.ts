import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import appRootPath from "app-root-path";
//[note] genera gráficos en forma de imagen
import QuickChart from "quickchart-js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { converToDate } from "../../common/utils/date";
import { weekValidation } from "../../week/week.validation";
import { Semana } from "@prisma/client";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { I_ParteDiario } from "../models/dailyPart.interface";
export class DailyPartPdfService {
  createOptionSandBox() {
    let options = {};

    //[note] aca decimos si el codigo está corriendo en un entorno de producción
    const production = false;

    //[note] si ya está corriendo en un entorno así lo configuramos para Puppeteer
    if (production) {
      options = {
        //[note] lo colocamos así ya q es ideal para servidores
        headless: true,
        //[note] esto es útil el navegador no está en su ubicación predeterminada.
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };
    }

    return options;
  }

  async createImage(user_id: number, date: string) {
    const dateNew = converToDate(date);
    dateNew.setUTCHours(0, 0, 0, 0);
    const dateWeekResponse = await weekValidation.findByDate(dateNew);
    const week = dateWeekResponse.payload as Semana;
    const inicio = week.fecha_inicio;
    const fin = week.fecha_fin;
    const fechas: string[] = [];
    for (let d = inicio; d <= fin; d.setDate(d.getDate() + 1)) {
      fechas.push(new Date(d).toISOString().slice(0, 10));
    }
    const dailyPartsResponse =
      await dailyPartReportValidation.findByDateAllDailyPartSend(fechas);
    const chart = new QuickChart();

    const dailysPart = dailyPartsResponse.payload as I_ParteDiario[];

    const total = [0, 0, 0, 0, 0, 0, 0];

    dailysPart.forEach((element) => {
      const elementDate = element.fecha
        ? element.fecha.toISOString().slice(0, 10)
        : "";
      // Buscamos la posición de la fecha en el array `fechas`
      const index = fechas.indexOf(elementDate);

      if (index !== -1) {
        // Si la fecha existe en el array `fechas`, sumamos el valor deseado
        total[index] += element.Trabajo?.costo_partida || 0;
      }
    });
   

    chart
      .setConfig({
        type: "line",
        data: {
          labels: [
            fechas[0],
            fechas[1],
            fechas[2],
            fechas[3],
            fechas[4],
            fechas[5],
            fechas[6],
          ],
          datasets: [
            {
              label: "Producción",
              data: [total[0], total[1], total[2], total[3], total[4], total[5], total[6]],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              pointBackgroundColor: "#0074D9",
              pointBorderColor: "#fff",
              pointRadius: 5,
              fill: false,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: "bottom", // Mueve la leyenda hacia abajo
            },
            datalabels: {
              align: "top",
              anchor: "end",
              formatter: (value) =>
                `S/ ${value.toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })}`,
              color: "#000",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Fecha",
              },
              offset: true, // Añadir un pequeño desplazamiento al inicio y al final del eje x
              ticks: {
                align: "start", // Alinea las etiquetas del eje x al principio del espacio del tick
              },
            },
            y: {
              title: {
                display: true,
                text: "Producción (S/)",
              },
            },
          },
        },
      })
      .setWidth(800)
      .setHeight(600);

    // const url = chart.getUrl();
    //[note]  Genera la imagen como un buffer binario, que es útil para manipular o guardar archivos.
    const imageBuffer = await chart.toBinary();
    let direction = "";
    direction = path.join(
      appRootPath.path,
      "static",
      "charts",
      `chart-${user_id}.png`
    );
    //[note] Guarda el buffer binario en el sistema de archivos
    fs.writeFileSync(direction, imageBuffer);
  }

  //[message] crean diferentes templates los próximos métodos

  async createPdf(template: string, user_id: number) {
    //[note] hacemos esto para eliminar que no haya pdfs duplicados
    this.deletePdfs(user_id);

    //[note] abajo inicias puppeter y abris un navegador para empezar a generarlo
    const options = this.createOptionSandBox();

    //[note] inicia un nagegador con las opciones definidas
    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();

    //[note] Rellena la página con el HTML proporcionado en template
    //[note]waitUntil: "networkidle0": Espera a que no haya conexiones de red activas antes de
    //[note] continuar (útil para cargar recursos externos como imágenes o estilos).
    await page.setContent(template, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();
    let direction = "";
    direction = path.join(
      appRootPath.path,
      "static",
      "reports",
      `informe-${user_id}.pdf`
    );
    await fs.promises.writeFile(direction, pdfBuffer);
  }

  async createPdfPD(template: string, user_id: number) {
    this.deletePdfsPD(user_id);

    const options = this.createOptionSandBox();

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    await page.setContent(template, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();
    let direction = "";
    direction = path.join(
      appRootPath.path,
      "static",
      "reports-pd",
      `informe-${user_id}.pdf`
    );
    await fs.promises.writeFile(direction, pdfBuffer);
  }

  deletePdfs(user_id: number) {
    const directory = path.join(appRootPath.path, "static", "reports");
    // const directory = path.resolve(__dirname, "static/reports");

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error leyendo la carpeta:", err);
        return;
      }

      files.forEach((file) => {
        // Verificar si el archivo es un PDF y corresponde al user_id
        // const userPrefix = `informe-${user_id}-`;
        const userPrefix = `informe-`;
        if (
          file.endsWith(".pdf") &&
          file.startsWith(userPrefix) &&
          !file.includes(String(user_id))
        ) {
          const filePath = path.join(directory, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              // console.error(`Error eliminando el archivo ${file}:`, err);
            } else {
              // console.log(`Archivo eliminado: ${file}`);
            }
          });
        }
      });
    });
  }

  deletePdfsPD(user_id: number) {
    const directory = path.join(appRootPath.path, "static", "reports-pd");
    // const directory = path.resolve(__dirname, "reports-pd");

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error leyendo la carpeta:", err);
        return;
      }

      files.forEach((file) => {
        // Verificar si el archivo es un PDF y corresponde al user_id
        // const userPrefix = `informe-${user_id}-`;
        const userPrefix = `informe-`;
        if (
          file.endsWith(".pdf") &&
          file.startsWith(userPrefix) &&
          !file.includes(String(user_id))
        ) {
          const filePath = path.join(directory, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              // console.error(`Error eliminando el archivo ${file}:`, err);
            } else {
              // console.log(`Archivo eliminado: ${file}`);
            }
          });
        }
      });
    });
  }

  deleteImages(user_id: number) {
    const directory = path.join(appRootPath.path, "static", "charts");
    // const directory = path.resolve(__dirname, "charts");
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error al leer el directorio charts:", err);
        return;
      }

      files.forEach((file) => {
        // Verificar si el archivo pertenece al user_id y no es la imagen actual
        // const userPrefix = `chart-${user_id}-`;
        const userPrefix = `chart-`;
        if (file.startsWith(userPrefix) && !file.includes(String(user_id))) {
          const filePath = path.join(directory, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              // console.error(`Error eliminando el archivo ${file}:`, err);
            } else {
              // console.log(`Archivo eliminado: ${file}`);
            }
          });
        }
      });
    });
  }
}

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import appRootPath from "app-root-path";
//[note] genera gráficos en forma de imagen
import QuickChart from "quickchart-js";
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

  async createImage(user_id: number) {
    const chart = new QuickChart();
    //[note] como lo vamos a crear y configurar del gráfico
    chart
      .setConfig({
        type: "line",
        data: {
          labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
          datasets: [
            {
              label: "Parte Diario",
              data: [30, 20, 40, 50, 60],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
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

    //[note] crea una nueva pestaña en el navegador
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
    //[note] acá es a donde lo vamos a guardar
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

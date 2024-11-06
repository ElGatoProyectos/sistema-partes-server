import { departureJobValidation } from "../departure/departure-job/departureJob.validation";
import { I_DepartureJobExcel } from "../departure/departure-job/models/departureJob.interface";
import { Partida, Trabajo } from "@prisma/client";

// const sunatService = new SunatService();
async function testSyncronize(
  data: I_DepartureJobExcel,
  project_id: string,
  job_id: string,
  departure_id: string
) {
  const detail = await departureJobValidation.createDetailDepartureJobFromExcel(
    data,
    +project_id,
    +job_id,
    +departure_id
  );

  if (!detail) {
    ///[note] debo enviar así xq process.send es una función que se usa en procesos hijos para enviar mensajes al proceso padre.
    process.send?.({
      error: true,
      message: "Ocurrió un error al realizar la sincronización",
    });
  }

  process.send?.({
    error: false,
    message: "Sincronización realizada con éxito",
  });
}

const data = JSON.parse(process.argv[2]);
const project_id = process.argv[3];
const job_id = process.argv[4];
const departure_id = process.argv[5];

testSyncronize(data, project_id, job_id, departure_id);

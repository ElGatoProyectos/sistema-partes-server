// import { departureJobValidation } from "../departure/departure-job/departureJob.validation";
// import { I_DepartureJobExcel } from "../departure/departure-job/models/departureJob.interface";

// async function testSyncronize(data: I_DepartureJobExcel, project_id: string) {
//   const updateJob = await departureJobValidation.updateDepartureJob(
//     data,
//     +project_id
//   );

//   if (!updateJob) {
//     ///[note] debo enviar así xq process.send es una función que se usa en procesos hijos para enviar mensajes al proceso padre.
//     process.send?.({
//       error: true,
//       message: "Ocurrió un error al realizar la sincronización",
//     });
//   }

//   process.send?.({
//     error: false,
//     message: "Sincronización realizada con éxito",
//   });
// }

// const data = JSON.parse(process.argv[2]);
// const project_id = process.argv[3];

// testSyncronize(data, project_id);
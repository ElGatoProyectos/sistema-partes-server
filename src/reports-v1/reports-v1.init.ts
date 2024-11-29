import express from "express";
import { reportTareoService } from "./tareo.service";
import { reportTren } from "./tren.service";
import { reporteProduccionService } from "./reporte-produccion.service";
import { reporteProduccionServiceId } from "./reporte-produccion-id.service";
import { reporteAvancePartidas } from "./reporte-avance-partida.service";

const reportV1Router = express.Router();

reportV1Router.get("/report-tareo", async (req, res) => {
  // condicion 1: Si no viene una semana, tienes que tomar el actual por defecto

  const week = String(req.query.week);
  const search = String(req.query.search);
  const category = Number(req.query.category);

  const response = await reportTareoService(week, search, category);

  res.status(response.statusCode).json(response);
});

reportV1Router.get("/report-tren", async (req, res) => {
  const week = String(req.query.week);

  const response = await reportTren(week);

  res.status(response.statusCode).json(response);
});

reportV1Router.get("/report-produccion", async (req, res) => {
  console.log("hello");
  const week = String(req.query.week);

  const response = await reporteProduccionService(week);

  res.status(response.statusCode).json(response);
});

reportV1Router.get("/report-produccion/:work_id", async (req, res) => {
  console.log("hello");
  const week = String(req.query.week);
  const work_id = Number(req.params.work_id as String);

  const response = await reporteProduccionServiceId(work_id, week);

  res.status(response.statusCode).json(response);
});

reportV1Router.get("/report-partida", async (req, res) => {
  const week = String(req.query.week);

  const response = await reporteAvancePartidas(week);

  res.status(response.statusCode).json(response);
});

// [note] TODO SOBRE DASHBOARD - 1

reportV1Router.get("/dashboard-1-cards", async (req, res) => {
  const week = String(req.query.week);

  const response = await reporteAvancePartidas(week);

  res.status(response.statusCode).json(response);
});

reportV1Router.get("/dashboard-1-produccion-semana", async (req, res) => {
  const week = String(req.query.week);

  const response = await reporteAvancePartidas(week);

  res.status(response.statusCode).json(response);
});

reportV1Router.get("/dashboard-1-produccion-tren-semana", async (req, res) => {
  const week = String(req.query.week);

  const response = await reporteAvancePartidas(week);

  res.status(response.statusCode).json(response);
});

reportV1Router.get(
  "/dashboard-1-produccion-trabajo-semana",
  async (req, res) => {
    const week = String(req.query.week);

    const response = await reporteAvancePartidas(week);

    res.status(response.statusCode).json(response);
  }
);

reportV1Router.get("/dashboard-1-avance-trabajo-semana", async (req, res) => {
  const week = String(req.query.week);

  const response = await reporteAvancePartidas(week);

  res.status(response.statusCode).json(response);
});

reportV1Router.get(
  "/dashboard-1-ritmo-produccion-diario-semana",
  async (req, res) => {
    const week = String(req.query.week);

    const response = await reporteAvancePartidas(week);

    res.status(response.statusCode).json(response);
  }
);

reportV1Router.get(
  "/dashboard-1-ritmo-desviacion-mo-semana",
  async (req, res) => {
    const week = String(req.query.week);

    const response = await reporteAvancePartidas(week);

    res.status(response.statusCode).json(response);
  }
);

// [note] TODO SOBRE DASHBOARD - 2

reportV1Router.get("/dashboard-2", async (req, res) => {
  const week = String(req.query.week);

  const response = await reporteAvancePartidas(week);

  res.status(response.statusCode).json(response);
});

// [note] TODO SOBRE DASHBOARD - 3

reportV1Router.get("/dashboard-3", async (req, res) => {
  const week = String(req.query.week);

  const response = await reporteAvancePartidas(week);

  res.status(response.statusCode).json(response);
});

export default reportV1Router;

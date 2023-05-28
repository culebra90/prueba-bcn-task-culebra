const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const Util = require("./src/util/Util");
const ServiceTask = require("./src/ServiceTask");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get( "/task/:taskId", async (req, res) => {
  const validator = Util.validarEventGet(req, res);
  if (!validator) return;
  const taskId = req.params.taskId;
  const respuesta = await ServiceTask.obtenerTask(taskId);
  console.log("respuesta GET =>", respuesta);
  res.json(respuesta);
});

app.post("/task", async (req, res) => {
  const object = Util.validarEventPost(req, res);
  if (!object) return;
  const respuesta = await ServiceTask.procesarTask(object);
  console.log("respuesta POST =>", respuesta);
  res.json(respuesta);
});

exports.task = onRequest(app);

const express = require('express');
const router3 = express.Router();
const controlador = require("./controladorUsuario");
const path = require("path");


router3.get("/preguntas", controlador.preguntasAleatorias);
router3.get("/procesarNewQuestion", controlador.procesarNewQuestion);
router3.get("/viewQuestion/:id", controlador.verPregunta);
router3.get("/administrarPreguntas/:id", controlador.adminPreguntas);
router3.get("/newQuestion", controlador.newQuestion);

module.exports = router3;
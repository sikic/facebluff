const express = require('express');
const router2 = express.Router();
const controlador = require("./controladorUsuario");
const path = require("path");


router2.get("/newReplyToUser/:id", controlador.addCuaternaria);
router2.get("/adivinarRespuesta/:id", controlador.adivinar);
router2.get("/newReply/:id", controlador.addReply);

module.exports = router2;
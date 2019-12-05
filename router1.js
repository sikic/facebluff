const express = require('express');
const router1 = express.Router();
const controlador = require("./controlador");

//se encarga de mostrar el formulario de login
router1.get("/login", controlador.log);
router1.get("/formulario", controlador.mostrarform);
//coge los datos y comprueba si el usuario y la password estan bien
router1.post("/login_post",controlador.log_post);
router1.post("/procesar_post",controlador.formulario);
//funcion que no permite el paso a el resto de funciones
module.exports = router1;
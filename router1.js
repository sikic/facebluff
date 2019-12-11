const express = require('express');
const router1 = express.Router();
const controlador = require("./controlador");
const path = require("path");
const multer = require("multer");
const multerFactory = multer({ dest: path.join(__dirname, "uploads") });

///
//se encarga de mostrar el formulario de login
router1.get("/login", controlador.log);
//Muestra el formulario de Nuevo usuario y el de modificar Perfil
router1.get("/formulario", controlador.mostrarform);
//coge los datos y comprueba si el usuario y la password estan bien
router1.post("/login_post", controlador.log_post);
//Coge los datos del formulario y o crea un nuevo usuario o modifica uno existente.
router1.post("/procesar_post", multerFactory.single("fotoPerfil"), controlador.formulario);
//Funcion que nos muestra el perfil de los amigos etc...
router1.get("/perfil/:id", controlador.mostrarPerfil);
//Funcion que nos muestra nuestro propio perfil
router1.get("/perfil", controlador.mostrarPerfilLogueado);
//Funcion que nos muestra los amigos y solicitudes
router1.get("/amigos", controlador.friends);
//Muestra el buscador para el perfil de usuarios
router1.get("/procesarBusqueda", controlador.buscar);
//Desconexion de el usuario
router1.get("/log_out", controlador.exit);
//Procesa la solicitud de amistad entre dos usuarios
router1.get("/procesar_solicitud/:id", controlador.solicitar_Amistad);
//Acepta la amistad entre dos usuarios
router1.get("/aceptar/:id", controlador.aceptar_Amistad);
//Rechaza la amistad entre dos usuarios
router1.get("/rechazar/:id", controlador.rechazar_Amistad);
//Imagenes
router1.get("/imagen/:id", function (request, response) {
    let pathImg = path.join(__dirname, "uploads", request.params.id);
    response.sendFile(pathImg);
});

module.exports = router1;
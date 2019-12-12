const express = require("express");
const path = require("path");
const config = require("./config");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const controlador = require("./controladorUsuario");
const ficherosEstaticos = path.join(__dirname, "public");
const session = require('express-session');
const miRouterUsuarios = require("./routerUsuarios");
const miRouterPreguntas = require("./routerPreguntas");
const miRouterRespuestas = require("./routerRespuestas");


//sesiones
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parseador de datos
//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: true }));

//middleware estatico
app.use(express.static(ficherosEstaticos));
//Usamos el router de Usuarios
app.use(miRouterUsuarios);
//Usamos el router de Respuestas
app.use(miRouterRespuestas);
//Usamos el router de Preguntas
app.use(miRouterPreguntas);
//error505
app.use(error500);
//vista de perfil
app.use(controlador.estaLogeado);

function error500(error, request, response, next) {
    // Código 500: Internal server error
    response.status(500);
    response.render("error500");
}

app.listen(config.port, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: "
            + err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});
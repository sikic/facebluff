const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const controlador = require("./controlador");
const ficherosEstaticos = path.join(__dirname, "public");
const session = require('express-session');
const config = require("./config");
const expressValidator = require("express-validator");

//sesiones
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database });

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

//se encarga de mostrar el formulario de login
app.get("/login", controlador.log);
//coge los datos y comprueba si el usuario y la password estan bien
app.post("/login_post",controlador.log_post);
app.post("/procesar_post", controlador.formulario);
//funcion que no permite el paso a el resto de funciones
app.use(controlador.estaLogeado);



//validador de datos
// app.use(expressValidator());

//vista amigos
app.get("/amigos",controlador.friends);
app.get("/procesarBusqueda", controlador.buscar);
app.get("/log_out",controlador.exit);
app.get("/procesar_solicitud/:id",controlador.solicitar_Amistad);
app.get("/aceptar/:id",controlador.aceptar_Amistad);
app.get("/rechazar/:id",controlador.rechazar_Amistad);



//-----
//vista de perfil
//app.get("/perfil".controlador.)
function error500(error, request, response, next) {
    // Código 500: Internal server error
    response.status(500);
    response.render("error500", {
        mensaje: error.message,
        pila: error.stack
    }
    )
};

//para el error 404
app.use(controlador.error404);
//app.use(error500);

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: "
            + err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});
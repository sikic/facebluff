//dao donde se comprueba todo lo de la base de datos
const modelo = require("./modelo");
const mysql = require("mysql");
//configuracion de la base de datos
const config = require("./config");
const pool = mysql.createPool(config.mysqlConfig);
//creacion de obj para validacion de formularios
const expressValidator = require("express-validator");
const mod = new modelo(pool);

function login(request, response) {
    response.render("login", { message: null });
}

function amigos(request, response) {
    //PRUEBAASSSSSS

    mod.getSolicitudes(request.session.currentUser, function (err, resultado) {
        if (err)
            console.log(err.message);
        else {
            mod.getFriends(request.session.currentUser,function(err,amistades){
                if (err)
                console.log(err.message);
                else{
                    response.render("amigos", { usuarios: resultado,amigos:amistades });
                }
            });
        }
    });
}
function mostrarFormulario(request,response){
    var usuarioLog = true;
    if(request.session.currentUser === undefined || request.session.currentUser == -1 ) usuarioLog = false;
    response.render("formulario", {usuarioLogeado : usuarioLog});
}

function comprobar(request, response, next) {
    // Comprueba si el usuario esta logeado
    if (request.session.currentUser === undefined || request.session.currentUser == -1) {
        response.redirect("/login");
    } else {
        // En caso contrario, se pasa el control al siguiente middle
        next();
    }
}
function perfil(request, response) {
    response.render("perfil", { message: null });
}

function salir(request, response){
    request.session.currentUser = -1;
    response.redirect("/login");
}

function check(request, response) {
    let usuario = {
        email: request.body.email,
        password: request.body.contraseña
    }
    mod.checkUser(usuario.email, usuario.password, function (err, resultado) {
        if (err) {
            response.status(500);
            response.render("login", { message: "Error interno en la base de datos." });
        }
        else {
            if (resultado != null) {
                response.status(200);
                request.session.currentUser = resultado.id;
                response.render("perfil", { usuario: resultado })
            }
            else {
                response.status(200);
                response.render("login", { message: "Email y/o correo incorrectos.Inténtelo de nuevo." })
            }
        }
    });
}
function e404(request, response, next) {
    // Código 400: Internal server error
    var choice = [];
    choice.push("Die");
    choice.push("Go back")
    response.status(404);
    response.render("error404", {
        mensaje: choice[0],
        mensaje1: choice[1]
    });
}

function formulario_post(request, response) {

    // request.checkBody("email", "Falta rellenar el email").notEmpty();

    let usuarioNuevo = {
        nombre: request.body.nombre,
        email: request.body.email,
        contraseña: request.body.contraseña,
        fechaNacimiento: request.body.fechaNacimiento,
        sexo: request.body.s,
        fotoPerfil: request.body.fotoPerfil,
        puntos: 0
    }

    if(request.session.currentUser === undefined || request.session.currentUser == -1 ){
    mod.insertUser(usuarioNuevo, function (err, resultado) {
        if (err)
            console.log(err.message);
        else {
            response.status(200);
            request.session.currentUser = resultado;
            response.render("perfil", { usuario: usuarioNuevo })
        }
    });
    }
 else{
     usuarioNuevo.id = request.session.currentUser;
     mod.modificarUser(usuarioNuevo,function(err,resultado){
        if(err)
            console.log(err.message);
        else{
            response.status(200);
            response.render("perfil", { usuario: usuarioNuevo })
        }
     });
 }
}

function busqueda(request,response){
    console.log(request.query.busqueda);
    mod.search(request.query.busqueda,function(err,resultado){
        if(err)
            console.log(err.message);
        else{
            response.render("busqueda",{usuarios:resultado,cad:request.query.busqueda});
        }
    });
}

function solicitarAmistad(request,response){
    mod.addSolicitud(request.session.currentUser, request.params.id,function(err){
        if(err)
            console.log(err.message);
        else{
            response.redirect("/amigos");
        }
    });
}

function aceptarAmistad(request,response){
    mod.aceptarSolicitud(request.session.currentUser, request.params.id,function(err){
        if(err)
            console.log(err.message);
        else{
            response.redirect("/amigos");
        }
    });
}

function rechazarAmistad(request,response){
    mod.rechazarSolicitud(request.session.currentUser, request.params.id,function(err){
        if(err)
            console.log(err.message);
        else{
            console.log("rechazada");
            response.redirect("/amigos");
        }
    }); 
}

function preguntasRandom(request,response){
    mod.randomQuestions(function(err,resultado){
        if(err)
            console.log(err.message);
        else{
            response.render("listadoPreguntas",{preguntas:resultado});
        }
    });
}

function viewQuestion(request,response){
    mod.viewReplys(request.params.id,function(err,resultado){
        if(err)
            console.log(err);
        else{
            response.render("");
        }
    });
}
module.exports = {
    log: login,
    log_post: check,
    error404: e404,
    formulario: formulario_post,
    friends: amigos,
    estaLogeado: comprobar,
    buscar : busqueda,
    exit :salir,
    solicitar_Amistad:solicitarAmistad,
    aceptar_Amistad:aceptarAmistad,
    rechazar_Amistad : rechazarAmistad,
    preguntasAleatorias : preguntasRandom,
    mostrarform : mostrarFormulario,
    verPregunta:viewQuestion
}
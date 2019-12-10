//dao donde se comprueba todo lo de la base de datos
const modelo = require("./modelo");
const mysql = require("mysql");
//configuracion de la base de datos
const config = require("./config");
const pool = mysql.createPool(config.mysqlConfig);
//creacion de obj para validacion de formularios
const { validationResult } = require("express-validator");
const mod = new modelo(pool);
let _ = require("underscore");

function login(request, response) {
    response.render("login", { message: null, points: request.session.puntos });
}
function amigos(request, response) {

    mod.getSolicitudes(request.session.currentUser, function (err, resultado) {
        if (err)
            console.log(err.message);
        else {
            mod.getFriends(request.session.currentUser, function (err, amistades) {
                if (err)
                    console.log(err.message);
                else {
                    console.log(amistades);
                    console.log(resultado);
                    response.render("amigos", { usuarios: resultado, amigos: amistades, points: request.session.puntos });
                }
            });
        }
    });
}
function mostrarFormulario(request, response) {
    var usuarioLog = true;
    var aux = [];
    if (request.session.currentUser === undefined || request.session.currentUser == -1) usuarioLog = false;
    response.render("formulario", { usuarioLogeado: usuarioLog, points: request.session.puntos, errores: aux });
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
    mod.getDataUser(request.params.id, function (err, resultado) {
        if (err)
            console.log(err.message);
        else {

            response.render("perfil", { usuario: resultado, points: request.session.puntos, imagen: resultado.fotoPerfil });
        }

    });

}
function perfilLogueado(request, response) {

    mod.getDataUser(request.session.currentUser, function (err, resultado) {
        if (err)
            console.log(err.message);
        else {
            console.log(request.session.foto);
            response.render("perfil", { usuario: resultado, points: request.session.puntos, imagen: resultado.fotoPerfil });
        }

    });

}

function salir(request, response) {
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
                request.session.puntos = resultado.puntos;
                response.redirect("/perfil/" + resultado.id);
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

    const errors = validationResult(request).array();
    var x = true;
    if (request.session.currentUser === undefined || request.session.currentUser == -1)
        x = false;
    if (errors.length == 0) {//no hay ningun error por lo tanto se puede proseguir

        let usuarioNuevo = {
            nombre: request.body.nombre,
            email: request.body.email,
            contraseña: request.body.contraseña,
            fechaNacimiento: request.body.fechaNacimiento,
            sexo: request.body.s,
            puntos: 0
        }
        if (request.file) {
            usuarioNuevo.fotoPerfil = request.file.filename;
        }

        if (!x) {
            mod.insertUser(usuarioNuevo, function (err, resultado) {
                if (err)
                    console.log(err.message);
                else {
                    response.status(200);
                    request.session.currentUser = resultado;
                    request.session.puntos = 0;
                    request.session.foto = request.file.filename;
                    response.redirect("/perfil");
                }
            });
        }
        else {
            //
            usuarioNuevo.id = request.session.currentUser;
            mod.modificarUser(usuarioNuevo, function (err, resultado) {
                if (err)
                    console.log(err.message);
                else {
                    response.status(200);
                    response.redirect("/perfil");
                }
            });
        }
    } else { //hay errores y hay que renderizar la pag de formulario
        response.render("formulario", { usuarioLogeado: x, points: request.session.puntos, errores: errors });

    }
}

function busqueda(request, response) {
    console.log(request.query.busqueda);
    mod.search(request.query.busqueda, function (err, resultado) {
        if (err)
            console.log(err.message);
        else {
            var i = _.findIndex(resultado, n => n.id == request.session.currentUser);
            resultado.splice(i, 1);
            response.render("busqueda", { usuarios: resultado, cad: request.query.busqueda, p: request.session.puntos });
        }
    });
}

function solicitarAmistad(request, response) {
    mod.addSolicitud(request.session.currentUser, request.params.id, function (err) {
        if (err)
            console.log(err.message);
        else {
            response.redirect("/amigos");
        }
    });
}

function aceptarAmistad(request, response) {
    mod.aceptarSolicitud(request.session.currentUser, request.params.id, function (err) {
        if (err)
            console.log(err.message);
        else {
            response.redirect("/amigos");
        }
    });
}

function rechazarAmistad(request, response) {
    mod.rechazarSolicitud(request.session.currentUser, request.params.id, function (err) {
        if (err)
            console.log(err.message);
        else {
            console.log("rechazada");
            response.redirect("/amigos");
        }
    });
}

function preguntasRandom(request, response) {
    mod.randomQuestions(function (err, resultado) {
        if (err)
            console.log(err.message);
        else {
            response.render("listadoPreguntas", { preguntas: resultado, points: request.session.puntos });
        }
    });
}

function viewQuestion(request, response) {
    mod.viewReplys(request.params.id, function (err, resultado) {
        if (err)
            console.log(err);
        else {
            mod.getAskDescription(request.params.id, function (err, descripcion) {
                if (err)
                    console.log(err.message);
                else
                    response.render("responderAmi", { pregunta: descripcion, respuestas: resultado, idPregunta: request.params.id, points: request.session.puntos });
            });
        }
    });
}

function newReply(request, response) {
    //como pasamos en el value de las respuestas su descripcion y su id separado por una barra procedemos para separarla
    var frase = request.query.radio.split("/");
    var descripcion = frase[0];
    var idRespuesta = frase[1];
    //añadimos esa respuesta a la tabla solo en caso de que sea la otra y guardamos lo que ha decicido el usuario
    if (request.query.radio == "otra") {
        mod.addReply(request.query.nueva, request.params.id, function (err, resultado) {
            if (err) {
                console.log(err);
            }
            else {
                mod.addReplytoTable(request.session.currentUser, request.params.id, resultado, function (err) {
                    if (err)
                        console.log(err);
                    else
                        response.redirect("/preguntas");
                });
            }
        });
    } else {
        //en caso de que sea una de las que vienen predefinidas no hace falta añadirla a la tabla de respuesta
        //pero si a la ternaria
        mod.addReplytoTable(request.session.currentUser, request.params.id, idRespuesta, function (err) {
            if (err)
                console.log(err);
            else
                response.redirect("/preguntas");
        });

    }

}

function showNewQuestion(request, response) {
    response.render("nuevaPregunta");
}

function newQuestion(request, response) {
    mod.addQuestion(request.query.pregunta, function (err) {
        if (err)
            console.log(err.message);
        else
            response.redirect("/preguntas");
    });
}

function adminQuestions(request, response) {
    //cogemos la descripcion de la pregunta
    mod.getAskDescription(request.params.id, function (err, descripcion) {
        var respondido;
        if (err)
            console.log(err);
        else {
            //ahora hay que comprobar si el usuario actual ha respondido o no a la pregunta
            mod.checkResponseOrNot(request.session.currentUser, request.params.id, function (err, resultado) {
                if (err)
                    console.log(err.message);
                else {
                    if (resultado.length == 0) { //el usuario actual aun respondido  a la pregunta
                        respondido = false;
                    } else {//el usuario si que ha respondido ya a la pregunta
                        respondido = true;
                    }
                    //cogemos los amigos que hayan respondido a esas preguntas
                    mod.getUsersToQuestion(request.params.id, function (err, lista) {
                        if (err)
                            console.log(err);
                        else { //si que hay amigos que han contestado esa pregunta
                            //hay que comprobar si lo que ellos han respondido coincide con lo que yo pienso que han
                            //respondido o todavia no he intentado adivinar nada 
                            //esta funcion devuelve un array con el id, mi respuesta sobre lo que puso y lo que realmente puso
                            mod.adivinar(request.params.id, request.session.currentUser, function (err, ar) {
                                if (err)
                                    console.log(err.message);
                                else {
                                    var lista1 = lista.filter(onlyUnique);
                                    var i = _.findIndex(lista1, n => n.id == request.session.currentUser);
                                    lista1.splice(i, 1);
                                    lista1.forEach((elm, i) => {
                                        var encontrado = ar.some(n => {
                                            if (n.idUsuario2 == elm.id) {
                                                return true;
                                            } else
                                                return false;

                                        });
                                        if (!encontrado) //no lo ha encontrado por lo tanto aun esta sin intentar adivinar
                                            lista1[i].x = 0;
                                        else {
                                            if (ar[i].miRespuesta == ar[i].respuestaReal) {// las respuesta coinciden por lo tanto he acertao
                                                lista1[i].x = 1;
                                            } else
                                                lista[i].x = -1;
                                        }
                                    });
                                    response.render("vistaPregunta", { pregunta: descripcion, contestado: respondido, amigos: lista1, id: request.params.id, points: request.session.puntos })
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function adivina(request, response) {
    //como pasamos en el value de las respuestas su descripcion y su id separado por una barra procedemos para separarla
    var frase = request.params.id.split("*");
    var idUsuario = frase[0];
    var idPregunta = frase[1];
    //cogemos la descripcion
    mod.getAskDescription(idPregunta, function (err, descripcion) {
        if (err)
            console.log(err.message);
        else {
            mod.viewReplys(idPregunta, function (err, resultado) {
                if (err)
                    console.log(err.message);
                else {
                    mod.getDataUser(idUsuario, function (err, datos) {
                        if (err)
                            console.log(err.message);
                        else
                            response.render("adivinar", { pregunta: descripcion, respuestas: resultado, nombre: datos.nombre, id: idPregunta, idUser: idUsuario });
                    });
                }
            });
        }
    });
}

function anadircuaternaria(request, response) {
    var frase = request.query.pregunta.split("/");
    var idUsuario = frase[2];
    var idPregunta = request.params.id;
    var idRespuesta = frase[1];

    //añadimos que el usuario actual a respondido sobre otro usuario    
    mod.addReplytoCuaternaria(request.session.currentUser, idUsuario, idPregunta, idRespuesta, function (err, resultado) {
        if (err) {
            console.log(err);
        }
        else {
            response.redirect("/administrarPreguntas/" + request.params.id);
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
    buscar: busqueda,
    exit: salir,
    solicitar_Amistad: solicitarAmistad,
    aceptar_Amistad: aceptarAmistad,
    rechazar_Amistad: rechazarAmistad,
    preguntasAleatorias: preguntasRandom,
    mostrarform: mostrarFormulario,
    verPregunta: viewQuestion,
    addReply: newReply,
    newQuestion: showNewQuestion,
    procesarNewQuestion: newQuestion,
    mostrarPerfil: perfil,
    mostrarPerfilLogueado: perfilLogueado,
    adivinar: adivina,
    newQuestion: showNewQuestion,
    procesarNewQuestion: newQuestion,
    mostrarPerfil: perfil,
    adminPreguntas: adminQuestions,
    addCuaternaria: anadircuaternaria
}
//dao donde se comprueba todo lo de la base de datos
const modeloUsuario = require("./modeloUsuario");
const modeloSolicitudes = require("./modeloSolicitudes");
const modeloAmigos = require("./modeloAmigos");
const modeloPreguntas = require("./modeloPreguntas");
const modeloRespuestas = require("./modeloRespuestas");

const mysql = require("mysql");
//configuracion de la base de datos
const config = require("./config");
const pool = mysql.createPool(config.mysqlConfig);
//modelos
const modUser = new modeloUsuario(pool);
const modRequest = new modeloSolicitudes(pool);
const modFriend = new modeloAmigos(pool);
const modReply = new modeloRespuestas(pool);
const modAsk = new modeloPreguntas(pool);



let _ = require("underscore");

//Muestra la vista del login
function login(request, response) {
    response.render("login", { message: null, points: request.session.puntos });
}

//muestra las solicitudes pendientes  y los amigos
function amigos(request, response, next) {
    modRequest.getSolicitudes(request.session.currentUser, function (err, resultado) {
        if (err)
            next();
        else {
            modFriend.getFriends(request.session.currentUser, function (err, amistades) {
                if (err)
                    next();
                else {
                    response.render("amigos", { usuarios: resultado, amigos: amistades, p: request.session.puntos, imagen: request.session.fotoPerfil });
                }
            });
        }
    });
}

//muestra la vista de formulario
function mostrarFormulario(request, response) {
    var usuarioLog = true;
    var aux = [];
    if (request.session.currentUser === undefined || request.session.currentUser == -1) usuarioLog = false;
    response.render("formulario", { usuarioLogeado: usuarioLog, p: request.session.puntos, errores: aux, imagen: request.session.fotoPerfil });
}

//Añade una nueva respuesta a la pregunta
function newReply(request, response, next) {
    //como pasamos en el value de las respuestas su descripcion y su id separado por una barra procedemos para separarla
    var frase = request.query.radio.split("/");
    var descripcion = frase[0];
    var idRespuesta = frase[1];
    //añadimos esa respuesta a la tabla solo en caso de que sea la otra y guardamos lo que ha decicido el usuario
    if (request.query.radio == "otra") {
        modReply.addReply(request.query.nueva, request.params.id, function (err, resultado) {
            if (err) {
                next();
            }
            else {
                modReply.addReplytoTable(request.session.currentUser, request.params.id, resultado, function (err) {
                    if (err)
                        next();
                    else
                        response.redirect("/preguntas");
                });
            }
        });
    } else {
        //en caso de que sea una de las que vienen predefinidas no hace falta añadirla a la tabla de respuesta
        //pero si a la ternaria
        modReply.addReplytoTable(request.session.currentUser, request.params.id, idRespuesta, function (err) {
            if (err)
                next();
            else
                response.redirect("/preguntas");
        });

    }


}

//funcion que hace la funcionalidad  de adivinar
function adivina(request, response, next) {
    //como pasamos en el value de las respuestas su descripcion y su id separado por una barra procedemos para separarla
    var frase = request.params.id.split("*");
    var idUsuario = frase[0];
    var idPregunta = frase[1];
    //cogemos la descripcion
    modAsk.getAskDescription(idPregunta, function (err, descripcion) {
        if (err)
            next();
        else {
            modReply.viewReplys(idPregunta, function (err, resultado) {
                if (err)
                    next();
                else {
                    modUser.getDataUser(idUsuario, function (err, datos) {
                        if (err)
                            next();
                        else {
                            response.render("adivinar", { pregunta: descripcion, respuestas: resultado, nombre: datos.nombre, id: idPregunta, idUser: idUsuario, p: request.session.puntos, imagen: request.session.fotoPerfil });
                        }
                    });
                }
            });
        }
    });
}

//Añade la respuesta que creo que otro usuario a dado a una respuesta
function anadircuaternaria(request, response, next) {
    var frase = request.query.pregunta.split("/");
    var idUsuario = frase[2];
    var idPregunta = request.params.id;
    var idRespuesta = frase[1];

    //añadimos que el usuario actual a respondido sobre otro usuario    
    modReply.addReplytoCuaternaria(request.session.currentUser, idUsuario, idPregunta, idRespuesta, function (err, resultado) {
        if (err) {
            next();
        }
        else {
            modReply.adivinar(idPregunta, request.session.currentUser, function (err, ar) {
                if (err)
                    next();
                else {
                    var i =_.findIndex(ar, n => n.idUsuario2 == idUsuario);
                    if (ar[i].respuestaReal == idRespuesta) {
                        request.session.puntos += 50;
                        modUser.updatePoints(request.session.currentUser, request.session.puntos, function (err, res) {
                            if (err)
                                next();
                                else{
                                    response.redirect("/administrarPreguntas/" + request.params.id);
                                }
                        });
                    }
                    else
                    response.redirect("/administrarPreguntas/" + request.params.id);
                }
            });
            
        }
    });
}
//funcion que comprueba si el usuario esta logeado para darle acceso o no a los apartados de la aplicacion
function comprobar(request, response, next) {
    // Comprueba si el usuario esta logeado
    if (request.session.currentUser === undefined || request.session.currentUser == -1) {
        response.redirect("/login");
    } else {
        // En caso contrario, se pasa el control al siguiente middle
        next();
    }
}

//funcion de perfil propio
function perfil(request, response, next) {
    modUser.getDataUser(request.params.id, function (err, resultado) {
        if (err)
            next();
        else {
            modUser.getFotosUsuario(request.params.id, function (err, res) {
                if (err)
                    next();
                else
                    resultado.id= request.params.id;
                    response.render("perfil", { usuario: resultado, p: request.session.puntos, imagen: resultado.fotoPerfil, id: request.session.currentUser, imgLogueado: request.session.fotoPerfil, fotosSubidas: res });
            });
        }

    });

}

//funcion de perfil ajeno
function perfilLogueado(request, response, next) {

    modUser.getDataUser(request.session.currentUser, function (err, resultado) {
        if (err)
            next();
        else {
            request.session.fotoPerfil = resultado.fotoPerfil;
            resultado.id = request.session.currentUser;
            modUser.getFotosUsuario(request.session.currentUser, function (err, res) {
                if (err)
                    next();
                else
                    response.render("perfil", { usuario: resultado, p: request.session.puntos, imagen: resultado.fotoPerfil, id: request.session.currentUser, imgLogueado: request.session.fotoPerfil, fotosSubidas: res });
            });

        }

    });

}

//funcion que hace el logOut
function salir(request, response) {
    request.session.currentUser = -1;
    response.redirect("/login");
}

//funcion que checkea la contraseña
function check(request, response, next) {

    let usuario = {
        email: request.body.email,
        password: request.body.contraseña
    }
    modUser.checkUser(usuario.email, usuario.password, function (err, resultado) {
        if (err) {
            response.status(500);
            next();
        }
        else {
            if (resultado != null) {
                response.status(200);
                request.session.currentUser = resultado.id;
                request.session.puntos = resultado.puntos;
                request.session.fotoPerfil = resultado.fotoPerfil;
                response.redirect("/perfil/" + resultado.id);
            }
            else {
                response.status(200);
                response.render("login", { message: "Email y/o correo incorrectos.Inténtelo de nuevo." })
            }
        }
    });
}

//funcion de error404
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

//funcion para la validacion del formulario
function isEmpty(value) {
    return value === undefined || value.length == 0;
}

//funcion para la validacion del formulario

function min(value, size) {
    if (value === undefined)
        return false;
    else
        return value.length > size;
}

//para las 5 preguntas aleatorias
function preguntasRandom(request, response, next) {
    modAsk.randomQuestions(function (err, resultado) {
        if (err)
            next();
        else {
            response.render("listadoPreguntas", { preguntas: resultado, p: request.session.puntos, imagen: request.session.fotoPerfil });
        }
    });
}

//cuando clickas dentro de una pregunta
function viewQuestion(request, response, next) {
    modReply.viewReplys(request.params.id, function (err, resultado) {
        if (err)
            next();
        else {
            modAsk.getAskDescription(request.params.id, function (err, descripcion) {
                if (err)
                    next();
                else
                    response.render("responderAmi", { pregunta: descripcion, respuestas: resultado, idPregunta: request.params.id, p: request.session.puntos, imagen: request.session.fotoPerfil });
            });
        }
    });
}

//mostrar nueva pregunta
function showNewQuestion(request, response) {
    response.render("nuevaPregunta", { p: request.session.puntos, imagen: request.session.fotoPerfil });
}

//procesar nueva pregunta
function newQuestion(request, response, next) {
    modAsk.addQuestion(request.query.pregunta, function (err) {
        if (err)
            next();
        else
            response.redirect("/preguntas");
    });
}
//funcion aux
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function adminQuestions(request, response, next) {
    //cogemos la descripcion de la pregunta
    modAsk.getAskDescription(request.params.id, function (err, descripcion) {
        var respondido;
        if (err)
            next();
        else {
            //ahora hay que comprobar si el usuario actual ha respondido o no a la pregunta
            modUser.checkResponseOrNot(request.session.currentUser, request.params.id, function (err, resultado) {
                if (err)
                    next();
                else {
                    if (resultado.length == 0) { //el usuario actual aun respondido  a la pregunta
                        respondido = false;
                    } else {//el usuario si que ha respondido ya a la pregunta
                        respondido = true;
                    }
                    //cogemos los amigos que hayan respondido a esas preguntas
                    modFriend.getUsersToQuestion(request.params.id,request.session.currentUser,function (err, lista) {
                        if (err)
                            next();
                        else { //si que hay amigos que han contestado esa pregunta
                            //hay que comprobar si lo que ellos han respondido coincide con lo que yo pienso que han
                            //respondido o todavia no he intentado adivinar nada 
                            //esta funcion devuelve un array con el id, mi respuesta sobre lo que puso y lo que realmente puso
                            modReply.adivinar(request.params.id, request.session.currentUser, function (err, ar) {
                                if (err)
                                    next();
                                else {
                                    var lista1 = lista.filter(onlyUnique);
                                    var i = _.findIndex(lista1, n => n.id == request.session.currentUser);
                                    if (i != -1)
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
                                            if(ar[i] !== undefined){
                                            if (ar[i].miRespuesta == ar[i].respuestaReal) {// las respuesta coinciden por lo tanto he acertao
                                                lista1[i].x = 1;
                                            } else
                                                lista1[i].x = -1;
                                        }
                                        else
                                        lista1[i].x = 1;
                                    }
                                    
                                    });
                                    response.render("vistaPregunta", { pregunta: descripcion, contestado: respondido, amigos: lista1, id: request.params.id, p: request.session.puntos, imagen: request.session.fotoPerfil })
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

//procesamiento de el formulario
function formulario_post(request, response, next) {
    const errors = new Array();
    if (isEmpty(request.body.email))
        errors.push("El email no puede estar vacio");

    if (isEmpty(request.body.nombre))
        errors.push("El nombre no puede estar vacio");

    if (isEmpty(request.body.s))
        errors.push("El sexo no puede estar vacio");

    if (!min(request.body.contraseña, 4))
        errors.push("La contraseña debe tener minimo 4 carácteres");

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
            request.session.foto = request.file.filename;
        }

        if (!x) {
            modUser.checkEmail(usuarioNuevo.email, function (err, res) {
                if (err)
                    next();
                else {
                    if (res.length == 0) {//no existe un usuario con ese email
                        modUser.insertUser(usuarioNuevo, function (err, resultado) {
                            if (err)
                                next();
                            else if (resultado.length != 0) {
                                response.status(200);
                                request.session.currentUser = resultado;
                                request.session.puntos = 0;
                                if (request.file)
                                    request.session.foto = request.file.filename;
                                response.redirect("/perfil");
                            }
                        });
                    } else { //existe un email identico
                        response.render("formulario", { usuarioLogeado: x, errores: ["Ya existe una cuenta con ese email,inténtelo de nuevo."] });
                    }
                }
            });
        }
        else {
            usuarioNuevo.id = request.session.currentUser;
            modUser.modUserificarUser(usuarioNuevo, function (err, resultado) {
                if (err)
                    next();
                else {
                    response.status(200);
                    response.redirect("/perfil");
                }
            });
        }
    } else { //hay errores y hay que renderizar la pag de formulario
        let puntos = 0;
        let imag = 0;
        response.render("formulario", { usuarioLogeado: x, errores: errors });
    }

}

//funcion que muestra el resultado de la busqueda de usuarios
function busqueda(request, response, next) {
    modFriend.search(request.query.busqueda, function (err, resultado) {
        if (err)
            next();
        else {
            var i = _.findIndex(resultado, n => n.id == request.session.currentUser);
            if (i != -1) {
                resultado.splice(i, 1);
            }
            response.render("busqueda", { usuarios: resultado, cad: request.query.busqueda, p: request.session.puntos, imagen: request.session.fotoPerfil });
        }
    });
}

//funcion que hace la solicitud de amistad de un usuario a otro
function solicitarAmistad(request, response, next) {
    modRequest.addSolicitud(request.session.currentUser, request.params.id, function (err) {
        if (err)
            next();
        else {
            response.redirect("/amigos");
        }
    });
}

//aceptar
function aceptarAmistad(request, response, next) {
    modRequest.aceptarSolicitud(request.session.currentUser, request.params.id, function (err) {
        if (err)
            next();
        else {
            response.redirect("/amigos");
        }
    });
}

//rechazar
function rechazarAmistad(request, response, next) {
    modRequest.rechazarSolicitud(request.session.currentUser, request.params.id, function (err) {
        if (err)
            next();
        else {
            response.redirect("/amigos");
        }
    });
}

//mostrar el input para subir una foto
function mostrarsubir(request, response) {
    response.render("subirFoto", { p: request.session.puntos, imagen: request.session.fotoPerfil });
}

//procesamiento de la subida de la foto
function subirfoto(request, response, next) {
    if (request.file){
        var foto = request.file.filename;
        modUser.addFotoUsuario(request.session.currentUser, foto, function (err) {
            if (err)
                next();
            else {
                let s = request.session.puntos - 100;

                modUser.updatePoints(request.session.currentUser, s, function (err, res) {
                    if (err)
                        next();
                    else
                        request.session.puntos = s;
                        response.redirect("/perfil");
                });
                
            }
        });
    }
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
    mostrarform: mostrarFormulario,
    mostrarPerfil: perfil,
    mostrarPerfilLogueado: perfilLogueado,
    mostrarSubir: mostrarsubir,
    subirFoto: subirfoto,
    preguntasAleatorias: preguntasRandom,
    verPregunta: viewQuestion,
    newQuestion: showNewQuestion,
    procesarNewQuestion: newQuestion,
    adminPreguntas: adminQuestions,
    addReply: newReply,
    adivinar: adivina,
    addCuaternaria: anadircuaternaria
}
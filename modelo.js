"use strict";
class modelo {
    constructor(pool) {
        this.pool = pool;
    }

    checkUser(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null)
            else {
                var sql = "SELECT u.id,u.nombre,u.fechaNacimiento,u.sexo,u.fotoPerfil,u.puntos  FROM usuarios u WHERE u.email = ? AND u.contraseña = ?";
                var params = [email, password];
                connection.query(sql, params, function (err, result) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else if (result.length == 0)
                        callback(err, null);
                    else {
                        var rs;
                        result.forEach(element => {
                            let edad = Date.now() - element.fechaNacimiento.getTime();
                            let anios = Math.round(edad / (1000 * 60 * 60 * 24) / 31 / 12);
                            let genero;
                            element.sexo == "masculino" ? genero = "Hombre" : genero = "Mujer";
                            rs = {
                                nombre: element.nombre,
                                fechaNacimiento: anios,
                                puntos: element.puntos,
                                sexo: genero,
                                fotoPerfil: element.fotoPerfil,
                                id: element.id
                            }
                        });
                        callback(null, rs);
                    }
                });
            }
        });

    }

    insertUser(data, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)";
                var params = [null, data.nombre, data.email, data.contraseña, data.fechaNacimiento, data.sexo, data.fotoPerfil, data.puntos];
                connection.query(sql, params, function (err, resul) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else
                        callback(null, resul.insertId);
                });
            }
        });
    }
    modificarUser(data, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "UPDATE usuarios SET nombre = ?,email = ?,contraseña = ?,fechaNacimiento = ? ,sexo = ?,fotoPerfil = ? WHERE id = ?";
                var params = [data.nombre, data.email, data.contraseña, data.fechaNacimiento, data.sexo, data.fotoPerfil, data.id];
                connection.query(sql, params, function (err, resul) {
                    connection.release();
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }
    //----------------------------------------
    getSolicitudes(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT DISTINCT u.nombre,u.fotoPerfil,s.idUsuario2 FROM usuarios u INNER JOIN solicitudes s ON u.id = s.idUsuario2 WHERE s.idUsuario1 = ? ";
                var params = id;
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else {
                        var rs = [];
                        resultado.forEach((elm, i) => {
                            var ar = {
                                nombre: elm.nombre,
                                fotoPerfil: elm.fotoPerfil,
                                id: elm.idUsuario2
                            }
                            rs.push(ar);
                        });
                        callback(null, rs);
                    }
                });
            }
        });
    }


    getFriends(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                //falla que solo se muestra la amistad en uno de los amigos , en el otro no
                var sql = "SELECT DISTINCT u.nombre,u.fotoPerfil,a.usuario1 FROM usuarios u INNER JOIN amigos a ON u.id = a.usuario1 WHERE a.usuario2 = ? ";
                var params = id;
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else {
                        var rs = [];
                        resultado.forEach((elm, i) => {
                            var ar = {
                                nombre: elm.nombre,
                                fotoPerfil: elm.fotoPerfil,
                                id: elm.usuario1
                            }
                            rs.push(ar);
                        });
                        callback(null, rs);
                    }
                });
            }
        });
    }




    search(cadena, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT u.nombre,u.fotoPerfil,u.id FROM usuarios u WHERE nombre LIKE ? ";
                var params = "%" + cadena + "%";
                connection.query(sql, params, function (err, resultado) {
                    connection.release();

                    if (err)
                        callback(err, null);
                    else {
                        var rs = [];
                        resultado.forEach(elm => {
                            var ar = {
                                nombre: elm.nombre,
                                fotoPerfil: elm.fotoPerfil,
                                id: elm.id
                            }
                            rs.push(ar);
                        });
                        callback(null, rs);
                    }
                });
            }
        });
    }

    addSolicitud(idSolicitante, idSolicitado, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "INSERT INTO solicitudes VALUES (?,?) ";
                var params = [idSolicitado, idSolicitante];
                connection.query(sql, params, function (err, result) {
                    connection.release();
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }

    aceptarSolicitud(idSolicitante, idSolicitado, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "DELETE FROM solicitudes   WHERE solicitudes.idUsuario2 = ?  AND solicitudes.idUsuario1 = ?";
                var params = [idSolicitado, idSolicitante];
                connection.query(sql, params, function (err, result) {
                    connection.release();
                    if (err)
                        callback(err);
                    else {
                        var sql2 = "INSERT INTO amigos VALUES (?,?) ";
                        var params2 = [idSolicitado, idSolicitante];
                        connection.query(sql2, params2, function (err, result) {
                            if (err)
                                callback(err);
                            else {
                                var sql3 = "INSERT INTO amigos VALUES (?,?) ";
                                var params3 = [idSolicitante, idSolicitado];
                                connection.query(sql3, params3, function (err, result) {
                                    connection.release();
                                    if (err)
                                        callback(err);
                                    else {
                                        callback(null);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    rechazarSolicitud(idSolicitante, idSolicitado, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "DELETE FROM solicitudes WHERE solicitudes.idUsuario2 = ?  AND solicitudes.idUsuario1 = ?";
                var params = [idSolicitado, idSolicitante];
                connection.query(sql, params, function (err, result) {
                    connection.release();
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }

    randomQuestions(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT pregunta.id,pregunta.descripcion FROM pregunta ORDER BY RAND() LIMIT ?";
                var params = 5;
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else {
                        var rs = [];
                        resultado.forEach(e => {
                            var ar = {
                                descripcion: e.descripcion,
                                id: e.id
                            }
                            rs.push(ar);
                        });
                        callback(null, rs);
                    }
                });
            }
        });
    }

    viewReplys(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT r.id,r.descripcion FROM respuesta r WHERE r.idPregunta = ?";
                var params = id;
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else
                        callback(null, resultado);
                });
            }
        });
    }

    addReply(descripcion, idPregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "INSERT INTO respuesta(descripcion,idPregunta) VALUES(?,?)";
                var params = [descripcion, idPregunta];
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else
                        callback(null, resultado.insertId);
                });
            }
        });
    }

    addReplytoTable(id, idRespuesta, idPregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "INSERT INTO usuario_pregunta_respuesta VALUES(?,?,?)";
                var params = [id, idRespuesta, idPregunta];
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }

    addQuestion(descripcion, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "INSERT INTO pregunta VALUES(?,?)";
                var params = [null, descripcion];
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }
    getDataUser(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT u.nombre,u.fechaNacimiento,u.sexo,u.fotoPerfil,u.puntos  FROM usuarios u WHERE u.id = ?";
                var params = id;
                connection.query(sql, id, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else {
                        var rs;
                        resultado.forEach(element => {
                            let edad = Date.now() - element.fechaNacimiento.getTime();
                            let anios = Math.round(edad / (1000 * 60 * 60 * 24) / 31 / 12);
                            let genero;
                            element.sexo == "masculino" ? genero = "Hombre" : genero = "Mujer";
                            rs = {
                                nombre: element.nombre,
                                fechaNacimiento: anios,
                                puntos: element.puntos,
                                sexo: genero,
                                fotoPerfil: element.fotoPerfil,
                                id: element.id
                            }
                        });
                        callback(null, rs);

                    }
                });

            }
        });
    }
    //funcion que da la descripcion de una pregunta
    getAskDescription(id,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql = "SELECT descripcion FROM pregunta WHERE id = ?";
                var params = [id];
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado[0].descripcion);
                });
            }
        });
    }

        //funcion que devuelve la respuesta que un usuario ha dado a una pregunta
    checkResponseOrNot(id,idPregunta,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql = "SELECT * FROM usuario_pregunta_respuesta WHERE idUsuario = ? AND idPregunta = ?";
                var params = [id,idPregunta];
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado);
                });
            }
        });
    }
    //funcion que devuelve los amigos que han respondido a una pregunta x
    getUsersToQuestion(idPregunta,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql ="SELECT DISTINCT us.nombre,us.fotoPerfil,us.id FROM usuario_pregunta_respuesta u INNER JOIN amigos a ON a.usuario2 = u.idUsuario INNER JOIN usuarios us ON a.usuario2 = us.id WHERE u.idPregunta = ?";
                var params = idPregunta;
                connection.query(sql, params, function (err, resultado){
                    connection.release();
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado);
                });
            }
        });
    }
    //funcion que da la respuesta que un usuario cree que ha dado otro
    getReplyForOtherUser(id,idUsuario,idPregunta,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql ="SELECT idRespuesta FROM cuaternaria WHERE idUsuario1 = ? AND idUsuario2 = ? AND idPregunta = ?";
                var params = [id,idUsuario,idPregunta];
                connection.query(sql, params, function (err, resultado){
                    connection.release();
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado);
                });
            }
        });
    }

    //funcion que devuelve el id de los usuarios , su respuesta real y lo que yo opino
    adivinar(pregunta,usuario,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql ="SELECT c.idUsuario2 ,c.idRespuesta miRespuesta,u.idRespuesta respuestaReal FROM usuario_pregunta_respuesta u LEFT JOIN cuaternaria c ON u.idUsuario = c.idUsuario2 AND c.idPregunta = u.idPregunta WHERE c.idPregunta = ? AND c.idUsuario1 = ?";
                var params = [pregunta,usuario];
                connection.query(sql, params, function (err, resultado){
                    connection.release();
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado);
                });
            }
        });
    }
    //funcion que devuelve una lista con los ids de los usuarios de los que he adivinado sus respuestas
    // SELECT c.idUsuario2 FROM usuario_pregunta_respuesta u LEFT JOIN cuaternaria c ON u.idRespuesta=c.idRespuesta WHERE c.idUsuario1= 18 AND c.idPregunta = 6

    //devuelve el usuario y la respuesta que yo creo que ha dado ese usuario
    // SELECT c.idUsuario2 ,c.idRespuesta FROM usuario_pregunta_respuesta u INNER JOIN cuaternaria c ON u.idUsuario = c.idUsuario2 WHERE c.idPregunta = 6 AND c.idUsuario1 = 18
    addReplytoCuaternaria(id,idUser,pregunta,respuesta,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql ="INSERT INTO cuaternaria VALUES(?,?,?,?)";
                var params = [id,idUser,pregunta,respuesta];
                connection.query(sql, params, function (err, resultado){
                    connection.release();
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado);
                });
            }
        });
    }
}
module.exports = modelo;
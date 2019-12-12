"use strict";
const moment = require("moment");
moment.locale('es');

class modeloReply {
    constructor(pool) {
        this.pool = pool;
    }

    //Devuelve las respuestas asociadas a una pregunta
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

    //Añade una respuesta a la pregunta
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

    //Añade una respuesta que un usuario da a una pregunta a la BD
    addReplytoTable(id, idRespuesta, idPregunta, callback){
        this.pool.getConnection(function (err, connection){
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
    
    //funcion que da la respuesta que un usuario cree que ha dado otro
    getReplyForOtherUser(id, idUsuario, idPregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT idRespuesta FROM cuaternaria WHERE idUsuario1 = ? AND idUsuario2 = ? AND idPregunta = ?";
                var params = [id, idUsuario, idPregunta];
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

    addReplytoCuaternaria(id, idUser, pregunta, respuesta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "INSERT INTO cuaternaria VALUES(?,?,?,?)";
                var params = [id, idUser, pregunta, respuesta];
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

    //funcion que devuelve el id de los usuarios , su respuesta real y lo que yo opino
    adivinar(pregunta, usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT c.idUsuario2 ,c.idRespuesta miRespuesta,u.idRespuesta respuestaReal FROM usuario_pregunta_respuesta u LEFT JOIN cuaternaria c ON u.idUsuario = c.idUsuario2 AND c.idPregunta = u.idPregunta WHERE c.idUsuario1 = ? AND c.idPregunta = ? AND c.idUsuario2 <> ?";
                var params = [usuario, pregunta, usuario];
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
}

module.exports = modeloReply;
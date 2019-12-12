"use strict";
const moment = require("moment");
moment.locale('es');

class modeloAsk {
    constructor(pool) {
        this.pool = pool;
    }

    //funcion que devuelve 5 preguntas aleatorias
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

    //Añadir nueva pregunta a la BD
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

    //funcion que da la descripcion de una pregunta
    getAskDescription(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT descripcion FROM pregunta WHERE id = ?";
                var params = [id];
                connection.query(sql, params, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else
                        callback(null, resultado[0].descripcion);
                });
            }
        });
    }
}

module.exports = modeloAsk;
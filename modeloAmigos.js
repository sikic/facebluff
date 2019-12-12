"use strict";
const moment = require("moment");
moment.locale('es');

class modeloFriends {
    constructor(pool) {
        this.pool = pool;
    }

    //Devuelve los amigos de un usuario
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

    //Busca los amigos que tengan las cadena "x" en su nombre
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

    //funcion que devuelve los amigos que han respondido a una pregunta x
    getUsersToQuestion(idPregunta,id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT DISTINCT us.nombre,us.fotoPerfil,us.id FROM usuario_pregunta_respuesta u INNER JOIN amigos a ON a.usuario2 = u.idUsuario INNER JOIN usuarios us ON a.usuario2 = us.id WHERE u.idPregunta = ? AND a.usuario1 = ?";
                var params = [idPregunta,id];
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

module.exports = modeloFriends;
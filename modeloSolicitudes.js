"use strict";
const moment = require("moment");
moment.locale('es');

class modeloRequest {
    constructor(pool) {
        this.pool = pool;
    }

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
}

module.exports = modeloRequest;

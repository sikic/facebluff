"use strict";
const moment = require("moment");
moment.locale('es');

class modeloUser {
    constructor(pool) {
        this.pool = pool;
    }

    //Comprueba la password y el email para logearte
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
                            let f = moment(element.fechaNacimiento);
                            let anios;
                            if (f.format('YYYY') !== "Invalid date") {
                                let edad = Date.now() - element.fechaNacimiento.getTime();
                                anios = Math.round(edad / (1000 * 60 * 60 * 24) / 31 / 12);
                            } else {
                                anios = -1;
                            }
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

    //comprueba el email para ver si existen duplicados
    checkEmail(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT id FROM usuarios WHERE email = ?";
                var params = email;
                connection.query(sql, params, function (err, resul) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else
                        callback(null, resul);
                });
            }
        });
    }

    insertUser(data, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql2 = "INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)";
                var params2 = [null, data.nombre, data.email, data.contraseña, data.fechaNacimiento, data.sexo, data.fotoPerfil, data.puntos];
                connection.query(sql2, params2, function (err, resul) {
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

    //Devuelve los datos de un usuario
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
                            let anios;
                            let f = moment(element.fechaNacimiento);
                            if (f.format('YYYY') !== "Invalid date") {
                                let edad = Date.now() - element.fechaNacimiento.getTime();
                                anios = Math.round(edad / (1000 * 60 * 60 * 24) / 31 / 12);
                            } else {
                                anios = -1;
                            }
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

    //funcion que devuelve la respuesta que un usuario ha dado a una pregunta
    checkResponseOrNot(id, idPregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT * FROM usuario_pregunta_respuesta WHERE idUsuario = ? AND idPregunta = ?";
                var params = [id, idPregunta];
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

    //actualiza los puntos de un usuario
    updatePoints(idUsuario, puntos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "UPDATE usuarios SET puntos = ? WHERE id = ?";
                let ActuPunt = puntos;
                var params = [ActuPunt, idUsuario];
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

    //funcion que devuelve las fotos que ha subido un usuario gracias a sus puntos
    getFotosUsuario(idUsuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT foto FROM fotos_subidas WHERE idUsuario = ?";
                var param = idUsuario;
                connection.query(sql, param, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else
                        callback(null, resultado);
                });
            }
        });
    }

    //funcion para añadir las fotos gracias a los puntos
    addFotoUsuario(idUsuario, foto, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "INSERT INTO fotos_subidas VALUES(?,?)";
                var param = [idUsuario, foto];
                connection.query(sql, param, function (err, resultado) {
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
module.exports = modeloUser;
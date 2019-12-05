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
    modificarUser(data,callback){
        this.pool.getConnection(function(err,connection){
            if(err)
            callback(err);
            else{
            var sql = "UPDATE usuarios SET nombre = ?,email = ?,contraseña = ?,fechaNacimiento = ? ,sexo = ?,fotoPerfil = ? WHERE id = ?";
            var params = [data.nombre,data.email,data.contraseña,data.fechaNacimiento,data.sexo,data.fotoPerfil, data.id];
            connection.query(sql,params,function(err,resul){
                if(err)
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
                var sql = "SELECT DISTINCT u.nombre,u.fotoPerfil,a.usuario2 FROM usuarios u INNER JOIN amigos a ON u.id = a.usuario1 WHERE a.usuario2 = ? ";
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




    search(cadena, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT u.nombre,u.fotoPerfil,u.id FROM usuarios u WHERE nombre LIKE ? ";
                var params = "%" + cadena + "%";
                connection.query(sql, params, function (err, resultado) {
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
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }

    randomQuestions(callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql = "SELECT pregunta.id,pregunta.descripcion FROM pregunta ORDER BY RAND() LIMIT ?";
                var params = 5;
                connection.query(sql, params, function (err, resultado) {
                    if (err)
                        callback(err,null);
                    else{
                        var rs = [];
                        resultado.forEach(e=>{
                            var ar = {
                                descripcion:e.descripcion,
                                id:e.id
                            }
                            rs.push(ar);
                        });
                        callback(null,rs);
                    }
                });
            }
        });
    }

    viewReplys(id,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql = "SELECT r.id,r.descripcion FROM respuesta r WHERE r.idPregunta = ?";
                var params = id;
                connection.query(sql, params, function (err, resultado) {
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado);
                });
            }
        });
    }

    addReply(descripcion,idPregunta,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err,null);
            else {
                var sql = "INSERT INTO respuesta(descripcion,idPregunta) VALUES(?,?)";
                var params = [descripcion, idPregunta];
                connection.query(sql, params, function (err, resultado) {
                    if (err)
                        callback(err,null);
                    else
                        callback(null,resultado.insertId);
                });
            }
        });
    }

    addReplytoTable(id,idRespuesta,idPregunta,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "INSERT INTO usuario_pregunta_respuesta VALUES(?,?,?)";
                var params = [id,idRespuesta, idPregunta];
                connection.query(sql, params, function (err, resultado) {
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }
    
    addQuestion(descripcion,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err);
            else {
                var sql = "INSERT INTO pregunta VALUES(?,?)";
                var params = [null,descripcion];
                connection.query(sql, params, function (err, resultado) {
                    if (err)
                        callback(err);
                    else
                        callback(null);
                });
            }
        });
    }
}

module.exports = modelo;
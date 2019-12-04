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
                        callback(err, resul.insertId);
                    else
                        callback(null, null);
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
                var sql = "SELECT u.nombre,u.fotoPerfil,s.idUsuario2 FROM usuarios u INNER JOIN solicitudes s ON u.id = s.idUsuario2 WHERE s.idUsuario1 = ? ";
                var params = id;
                connection.query(sql, params, function (err, result) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else {
                        var rs = [];
                        resultado.forEach((elm,i) => {
                                    var ar = {
                                        nombre: elm.nombre,
                                        fotoPerfil: elm.fotoPerfil,
                                        id:elm.idUsuario2
                                    }
                                    rs.push(ar);
                                });
                                callback(null, rs);
                            }
                        });
                    }
                });
            }
    }

    getFriends(id,callback){
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(err, null);
            else {
                var sql = "SELECT usuario2 FROM amigos WHERE usuario1 = ?";
                var params = id;
                connection.query(sql, [params], function (err, result) {
                    connection.release();
                    if (err)
                        callback(err, null);
                    else if (result.length == 0)
                        callback(null, null);
                    else {
                        var params2 = [];
                        var sql2 = "SELECT u.nombre,u.fotoPerfil FROM usuarios u WHERE id = ?";
                        result.forEach(e=>{
                            params2.push(e.usuario2);
                        });
                        connection.query(sql2, [params2], function (err, resultado) {
                            if (err)
                                callback(err);
                            else {
                                var rs = [];
                                resultado.forEach((elm,i) => {
                                    var ar = {
                                        nombre: elm.nombre,
                                        fotoPerfil: elm.fotoPerfil,
                                        id:params2[i]
                                    }
                                    rs.push(ar);
                                });
                                callback(null, rs);
                            }
                        });
                    }
                });
            }
        });
    }

    search(cadena,callback){
        this.pool.getConnection(function(err,connection){
            if(err)
                callback(err,null);
            else{
                var sql = "SELECT u.nombre,u.fotoPerfil,u.id FROM usuarios u WHERE nombre LIKE ? ";
                var params = "%"+cadena+"%";
                connection.query(sql,params,function(err,resultado){
                    if(err)
                        callback(err,null);
                    else{
                        var rs = [];
                        resultado.forEach(elm=>{
                            var ar = {
                                nombre:elm.nombre,
                                fotoPerfil:elm.fotoPerfil,
                                id:elm.id
                            }
                            rs.push(ar);
                        });
                        callback(null,rs);
                    }
                });
            }
        });
    }
}
module.exports = modelo;
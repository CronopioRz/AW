class DAOUsuario {
    constructor(pool) {  
        this.pool=pool;
    }

    /*
    Crea la cuenta del nuevo usuario:
       - Campos OBLIGATORIOS a introducir: correo, nombre, contraseña
       - Campo OPCIONAL: Imagen (si imagen == NULL, se le asigna una aleatoria)
       - Todos los usuarios empiezan con REPUTACIÓN 1
       - Fecha desde la que es miembro
    */
   crearCuenta(nombre, correo, contraseña, imagen, callback) {  
    this.pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            let imagenAInsertar;
            
            //Primero compruebo si la imagen es nula, para ver si hay que ponerle una aleatoria. 
            if (imagen == null){ //Tenemos 5 imágenes de perfil disponibles 
                imagen = Math.floor(Math.random() * (6 - 1) + 1); //número aleatorio entero entre 1 (incluido) y 6 (excluido)
                
                //Nuestras imágenes de perfil aleatorias se llaman "aleatoriaX", siendo X el número de la imagen.
                imagenAInsertar="aleatoria" + imagen + ".jpg";
            }else{
                imagenAInsertar=imagen;
            }

           
            connection.query("INSERT INTO usuario (Correo, Nombre, Contraseña, Imagen, Reputacion) VALUES ( ?, ?, ?, ?, 1)",
                [correo, nombre, contraseña, imagenAInsertar],
                function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de inserción" + err));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); 
                        }
                        else {
                            callback(null, true); 
                        }
                    }
                });
        }
    }
    );
}

/* Devuelve todos los usuarios que están en la base de datos
   La entrada es el correo del usuario que quiere que se muestren los demás usuarios (para que no salga él en la lista)
*/
  obtenerListaUsuarios(correo, callback) {   
    this.pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            //Usuarios con tags
            connection.query("SELECT U.Imagen, U.Reputacion, U.Nombre, T.nombre AS nombreEtiqueta, COUNT(T.nombre) AS Etiqueta FROM usuario U JOIN (pregunta P JOIN tag T) WHERE U.Correo=P.correoUsuario AND P.id=T.idPregunta AND U.correo <> ? ORDER BY Etiqueta DESC LIMIT 1",
            [correo],
                
                function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error:" + err));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); 
                        }
                        else {
                            //Usuarios sin preguntas o con preguntas sin tags
                            let sqlUsuariosSinTags =  connection.query("SELECT U.Imagen, U.Reputacion, U.Nombre  FROM usuario U JOIN pregunta P WHERE U.Correo<>? AND (U.Correo=P.correoUsuario OR U.Correo NOT IN (SELECT correoUsuario  FROM Pregunta)) AND P.id NOT IN (SELECT idPregunta FROM Tag)", [correo]);
                           
                            callback(null, rows);
                        }
                    }
                });
        }
    }
    );
}

}
module.exports = DAOUsuario;
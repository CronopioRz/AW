class DAOPyr {
    constructor(pool) {  
        this.pool=pool;
    }

    /* devuelve todas las preguntas en la BBDD*/
    getAllQuestions(callback) { 
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM `pregunta` ORDER BY `id` ASC ",
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está ninguna pregunta en la BBDD
                            }
                            else {
                                callback(null, rows);
                            }
                        }
                    });
            }
        }
        );
    }
    
    /* inserta en la BD la tarea task asociándola al usuario cuyo
    identificador es email . La tarea recibida como parámetro es un objeto que contiene tres atributos: text ,
    done y tags . El último de ellos, tags , es un array con las etiquetas asociadas a la tarea*/
    /*
    Dos consultas:
    una para insertar en la tabla task , y otra para insertar las etiquetas en la tabla tag. 
    */
   
    insertQuestion(email, head, body, callback) {  
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                /*Primero insertamos en la tabla task 
                ID NULL pero a la hora de insertarse en la base de datos, como el campo id es autoincremental, 
                se le asigna el valor siguiente del anterior id*/
                connection.query("INSERT INTO `pregunta` (`correoUsuario`, `titulo`, `cuerpo`) VALUES ( ?, ?, ?) ",
                    [email, head, body],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de inserción: " + err));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el correo proporcionado
                            }
                            else {
                                //Una vez que se ha insertado la tarea en la tabla task, la insertamos ahora el tabla 
                                //tags
                                callback(null, true); 
                            }
                        }
                    });
            }
        }
        );
    }
    
    /*marca la tarea idTask como realizada actualizando en la base
    de datos la columna done a true . El parámetro idTask es el identificador de la tarea dentro de la base de
    datos. */
    searchQuestionByTag(tagName, callback) {   
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT p.titulo, p.cuerpo, p.fecha, GROUP_CONCAT(t.nombre SEPARATOR ',') AS tags, u.nombre, u.imagen FROM (pregunta p RIGHT  JOIN tag t ON p.id = t.idpregunta) JOIN usuario u ON u.correo = p.correoUsuario WHERE t.idpregunta = (SELECT idpregunta FROM tag WHERE nombre = ?) GROUP BY p.titulo",
                    [tagName],
                    /*"SELECT p.titulo, p.cuerpo, p.fecha, t.nombre AS tags, u.nombre, u.imagen FROM (pregunta p LEFT OUTER JOIN tag t ON p.id = t.idpregunta) JOIN usuario u ON u.correo = p.correoUsuario WHERE t.nombre = ? " */
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de búsqueda"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está la tarea
                            }
                            else {
                                callback(null, rows);
                            }
                        }
                    });
            }
        }
        );
    }
    
    /* elimina todas las tareas asociadas al usuario cuyo correo es
    email y que tengan el valor true en la columna done .*/
    deleteCompleted(email, callback) {  
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                 //Tenemos configurada la opción en CASCADA al eliminar (si se eliminan la tarea de la tabla principal también se elimina de la secundaria los tags asociados a ella)
                connection.query("DELETE FROM task WHERE done=true AND user = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está la tarea
                            }
                            else {
                                callback(null, rows);
                            }
                        }
                    });
            }
        }
        );
    }

    getAllAnswersByQuestion(idPregunta,callback) { 
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT r.cuerpo, r.votos, u.nombre, u.imagen FROM (respuesta r JOIN usuario u ON r.correoUsuario = u.Correo) WHERE  r.idPregunta = ? ORDER BY r.idRespuesta" ,
                    [idPregunta],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está ninguna pregunta en la BBDD
                            }
                            else {
                                callback(null, rows);
                            }
                        }
                    });
            }
        }
        );
    }
    
   
   
    insertAnswer(email, idpregunta, body, callback) {  
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                /*Primero insertamos en la tabla task 
                ID NULL pero a la hora de insertarse en la base de datos, como el campo id es autoincremental, 
                se le asigna el valor siguiente del anterior id*/
                connection.query("INSERT INTO `respuesta` (`correoUsuario`, `idPregunta`, `cuerpo`) VALUES ( ?, ?, ?) ",
                    [email, idpregunta, body],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de inserción: " + err));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el correo proporcionado
                            }
                            else {
                                //Una vez que se ha insertado la tarea en la tabla task, la insertamos ahora el tabla 
                                //tags
                                callback(null, true); 
                            }
                        }
                    });
            }
        }
        );
    }
    
    /* elimina todas las tareas asociadas al usuario cuyo correo es
    email y que tengan el valor true en la columna done .*/
    deleteAnswer(email, callback) {  
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                 //Tenemos configurada la opción en CASCADA al eliminar (si se eliminan la tarea de la tabla principal también se elimina de la secundaria los tags asociados a ella)
                connection.query("DELETE FROM respuesta WHERE done=true AND user = ?",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está la tarea
                            }
                            else {
                                callback(null, rows);
                            }
                        }
                    });
            }
        }
        );
    }
}

module.exports = DAOPyr;
class DAOTasks {
    constructor(pool) {  
        this.pool=pool;
    }

    /* devuelve todas las preguntas en la BBDD*/
    getAllTasks(callback) { 
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT T.id, T.text, T.done, GROUP_CONCAT(E.tag) AS tags FROM task T JOIN tag E WHERE T.user = ? AND T.id = E.taskId group by T.id",
                    [email],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el correo proporcionado
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
    insertTask(email, task, callback) {  
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                /*Primero insertamos en la tabla task 
                ID NULL pero a la hora de insertarse en la base de datos, como el campo id es autoincremental, 
                se le asigna el valor siguiente del anterior id*/
                connection.query("INSERT INTO task (id, user, text, done) VALUES ( NULL, ?, ?, ?)",
                    [email, task.text, task.done],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el correo proporcionado
                            }
                            else {
                                //Una vez que se ha insertado la tarea en la tabla task, la insertamos ahora el tabla 
                                //tags
                                let id = rows.insertId; //Id de la tarea nueva insertada en la tabla task

                                //Recorremos el vector tags y vamos insertando en la tabla tags cada etiqueta 
                                for (let element of task.tags) {
                                    connection.query("INSERT INTO tag (taskId, tag) VALUES ( ?,?)",
                                    [id, element]);
                                }
                                
                                
                                let filasAfectadas = rows.affectedRows + task.tags.length;

                                callback(null, filasAfectadas); 
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
    markTaskDone(idTask, callback) {   
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("UPDATE task SET done=true WHERE id = ?",
                    [idTask],
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
}

module.exports = DAOTasks;
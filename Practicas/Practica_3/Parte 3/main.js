"use strict";

const mysql = require("mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");
const { getMaxListeners, exit } = require("process");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    port: config.port,
    password: config.password,
    database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks

//daoUser.isUserCorrect("p@gmail.com", "1234", cb_isUserCorrect);
//daoUser.getUserImageName("andrea@gmail.com", cb_getUserImageName);

//daoTask.getAllTasks("a@gmail.com", cb_getAllTasks);
//daoTask.markTaskDone(1, cb_markTaskDone);

//daoTask.deleteCompleted("a@gmail.com", cb_deleteCompleted);

/*let taskNueva = {
    tags: [],
    done: false,
    text: "Práctica Mates"
};*/

//daoTask.insertTask("a@gmail.com", taskNueva, cb_insertTask);

function cb_isUserCorrect(err, result) {
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Usuario y contraseña correctos");
    } else {
        console.log("Usuario y/o contraseña incorrectos");
    }
    pool.end();
}

function getUserImageName(err, result) {
    if (err) {
        console.log(err.message);
    } else if (!result){
        console.log("Usuario no encontrado");
    }else {
        console.log("El resultado es:", result);
    }
    pool.end();
}

function cb_getAllTasks(err, result) {
    if (err) {
        console.log(err.message);
    } else if (!result){
        console.log("Usuario no encontrado");
    }else {
        console.log("Lista de tareas:", result);
    }
    pool.end();
}

function cb_markTaskDone(err, result) {
    if (err) {
        console.log(err.message);
    } else if (!result){
        console.log("No se ha encontrado ninguna tarea con ese id");
    }else {
        console.log(result);
    }
    pool.end();
}

function cb_deleteCompleted(err, result) {
    if (err) {
        console.log(err.message);
    } else if (!result){
        console.log("No hay ninguna tarea completada");
    }else {
        console.log(result);
    }
    pool.end();
}

function cb_insertTask(err, result) {
    if (err) {
        console.log(err.message);
    } else if (!result){
        console.log("Error en la inserción");
    }else {
        console.log("Filas afectadas:", result);
    }
    pool.end();
}


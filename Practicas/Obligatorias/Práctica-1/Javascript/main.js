"use strict";

const mysql = require("mysql");
const config = require("./config");
const DAOUsuario = require("./DAOUsuario");
const DAOPyr = require("./DAOPyr");
const DAOTag = require("./DAOTag");
const { getMaxListeners, exit } = require("process");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    port: config.port,
    password: config.password,
    database: config.database
});

let daoUsuario = new DAOUsuario(pool);
let daoPyr = new DAOPyr(pool);

function cb_getAllQuestions(err, result) {
    if(err){
        console.log(err.message);
    } else if (!result){
        console.log("Error en la búsqueda");
    }else {
        console.log(result);
    }
    pool.end();
}

function cb_crearCuenta(err, result) {
    if (err) {
        console.log(err.message);
    } else if (!result){
        console.log("Usuario no encontrado");
    }else {
        console.log("Usuario dado de alta correctamente");
    }
}

function cb_insertQuestion(err, result) {
    if (err) {
        console.log(err.message);
    } else if (!result){
        console.log("Pregunta no insertada");
    }else {
        console.log("Pregunta dada de alta correctamente");
    }
}

function cb_searchQuestionByTag(err,result) {
    if(err){
        console.log(err.message);
    }
    else if (!result){
        console.log("No hay preguntas con ese tag");
    }
    else {
        console.log(result);
    }
}

function cb_getAllAnswersByQuestion(err,result) {
    if(err){
        console.log(err.message);
    }
    else if (!result){
        console.log("No hay respuestas en esta pregunta");
    }
    else {
        console.log(result);
    }
}


daoRespuesta.getAllAnswersByQuestion(1,cb_getAllAnswersByQuestion);


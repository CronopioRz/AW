//Grupo 15

"use strict"

let listaTareas = [
  { text: "Preparar práctica AW", tags: ["AW", "practica"] },
  { text: "Mirar fechas congreso", done: true, tags: [] },
  { text: "Ir al supermercado", tags: ["personal"] },
  { text: "Mudanza", done: false, tags: ["personal"] },
];

function getToDoTasks(tasks) {
  //Seleccionamos las tareas no finalizadas
  //Ponemos n.done!=true porque así también selecciona las tareas que no tengan done
  //ya que se considera que tienen valor "false".
    let tareasNoFinalizadas = tasks.filter(n => n.done!=true); 

   //Devolvemos solamente el nombre de cada tarea no finalizada
   return tareasNoFinalizadas.map(n => n.text);
}

//console.log(getToDoTasks(listaTareas));


function findByTag(tasks,tag){

    //Coge las tareas en las que alguno de sus tags coincida con el tag pasado por parámetro
    return tasks.filter(n=> n.tags.some(r=>r==tag));

    //return tasks.filter (n => ( n.tags.includes(tag)   )   );
}

//console.log(findByTag(listaTareas, "personal"));

function findByTags(tasks,tags){

 //De cada tarea de "tasks" (n), se comprueba que algún tag (r) de la tarea n
 //coincida con alguna etiqueta del array de entrada "tags".
   return tasks.filter(n=> n.tags.some(function(r){
        //Comprueba que algún elemento (z) del array de entrada tags
        //coincida con el tag r de la tarea n. 
        return tags.some(z => z==r);
   }));

   //return tasks.filter (n => n.tags.some( r => tags.includes(r)));
}

//console.log(findByTags(listaTareas, ["personal", "practica"]));

function countDone(tasks) {
    return tasks.reduce(function(ac,a){
            return  a.done ? ac + 1 : ac;
    },0);
}

//console.log(countDone(listaTareas));

function createTask(text) {

    let tar = {//nueva tarea
        text: '',
        done: false, //Al añadir una tarea nueva, no está finalizada
        tags: []
    }; 

    //Convertimos el texto de entrada en un array de caracteres
    let arrayTexto = Array.from(text);

    //Declaramos una variable booleana para saber en qué caso estamos(si en etiqueta o texto)
    let etiqueta; //Si tiene como valor false --> texto, si no --> etiqueta


    //Utilizamos el acumulador "ac" para ir guardando el nombre de la tarea(text) o una etiqueta (en tags).
    //a representa un caracter que se irá sumando a "ac" hasta que se encuentre con un " "; en este caso "ac" vuelve
    //a tomar el valor " " para averiguar si lo siguiente es una etiqueta o alguna palabra más para el nombre de la tarea.
    arrayTexto.reduce(function(ac,a, i){ //i --> índice del elemento actual de "arrayTexto"
        //CASOS
       //Primero averiguamos en cuál de los dos tipos estamos (si en etiqueta o en texto)
        if (ac == " "){
            if(a != "@" ) {
                etiqueta = false;  //Es un texto
            }

            else  etiqueta = true; 
        }

        //Caso ETIQUETA
        if (etiqueta){
            if (a == " "){ //Fin de la etiqueta
                tar.tags.push(ac);
                ac = " ";
            }
            else {
                if (a!="@") ac +=a;
                //Cambiamos el valor a "ac" para que en la siguiente vuelta no tenga un valor " "
                // y vuelva a meterse en el primer if y cambie a texto (ya que ya el caracter "a" ya no sería "@");
                else ac=""; 
            }

            //Si se ha llegado al final --> ya tenemos último tag
            if(i == (arrayTexto.length-1)){
                tar.tags.push(ac);
            }
        }
        else {  //Caso TEXTO
            
            if (a == " "){ //Fin del texto
                tar.text+=ac; 
                ac = " ";
            }
            else{
                ac+=a; 
            }

            if(i == (arrayTexto.length-1)){
                tar.text+=ac;
            }
        }

        return ac;

    }," ");

    tar.text = tar.text.slice(1, tar.text.length); //Eliminamos el espacio que hay al principio del nombre de la tarea

    return tar; //Devolvemos la nueva tarea
}

//let nuevaTarea = createTask("Ir al medico @personal @salud");
//console.log(nuevaTarea);
//listaTareas.push(nuevaTarea);
//console.log(listaTareas);
//console.log(createTask("@AW @practica Preparar práctica AW"));
//console.log(createTask("Ir a @deporte entrenar"));







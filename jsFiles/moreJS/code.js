// MAP Method
var hey = 'wasuup';
var numbers = [0x934fa, 0o2346, 0b1001011n, 3e-345, 45E21, 32452352314n];
var is = true || false;
console.log("Mis números:");

var person = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue"
};

for (let index = 0; index < numbers.length; index++) {
  console.log(numbers[index]);
}
/* 
   ******************** 
 * More code in english * 
   ******************** 
*/

const getAges = (person) => person.age * 2;

function toCelsius(fahrenheit) {
  return (5 / 9) * (fahrenheit - 32);
}

const newPeople = people.map((item) => {
  return {
    firsName: item.name.toUpperCase(),
    oldAge: item.age + 20,
  };
});
console.log(newPeople);

const names = people.map((person) => `${person.name}`);
const result = document.querySelector("#result");

result.innerHTML = names.join(names);

// import express and cors
const cors = require('cors');
const express = require('express');

// Create the express app with cors enable
const app = express();
app.use(cors());
app.options('*', cors()); // Aquí basicamente le decimos que todo mundo puede usar nuestra API 

// Define port
const port = 8085;

// define root controller (controlador principal) de tipo GET
app.get('/', (req, res, next) => { // El res es el que regresa cosas y el req recibe o recupera los parámetros
    res.send('Welcome to my api');
}); //El diagonal siempre significa la raiz


function facto(num) { // Función recursiva para obtener el factorial de un número
    return (num == 0) ? 1 : num * facto(num-1);
}

app.get('/suma', (req, res) => {
    var num1 = parseInt(req.query.num1);
    var num2 = parseInt(req.query.num2);
    var suma = num1 + num2;
    res.send({res: suma});
  })
  
  app.get('/resta', (req, res) => {
    var num1 = parseInt(req.query.num1);
    var num2 = parseInt(req.query.num2);
    var resta = num1 - num2;
    res.send({res: resta});
  })
  
  app.get('/multi', (req, res) => {
    var num1 = parseInt(req.query.num1);
    var num2 = parseInt(req.query.num2);
    var multip = num1 * num2;
    res.send({res: multip});
  })
  
  app.get('/divi', (req, res) => {
    var num1 = parseFloat(req.query.num1);
    var num2 = parseFloat(req.query.num2);
    var divis = num1 / num2;
    res.send({res: divis});
  })

  /*   app.get('/fact', (req, res) => {
        var num1 = parseFloat(req.query.num1);
        var factorial = facto(num1);
        res.send({res: factorial});
    }) */

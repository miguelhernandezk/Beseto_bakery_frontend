// module.exports = milk; in milk.js
const milk = require('./milk');

let llaves = Object.keys(milk);
let repetidos = []

for (let i =0; i<llaves.length; i++){
    if(llaves[i] === milk[llaves[i]].id){
        console.log("Son iguales");
    }
    else{
        console.log("Encontré una diferencia");
    }
}

console.log("Empezando a verificar tamaño de personas")
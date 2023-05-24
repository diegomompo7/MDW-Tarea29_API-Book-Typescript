const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Author } = require("../model/Author.js");

const authorList = [
  { name: "Miguel de Cervantes", country: "España", email: "miguel.cervantes@gmail.com", password: "DonQuijote123" },
  { name: "Federico García Lorca", country: "España", email: "federico.garcia@gmail.com", password: "PoetaDelAlma456" },
  { name: "Antonio Machado", country: "España", email: "antonio.machado@gmail.com", password: "CaminanteNoHayCamino789" },
  { name: "Miguel Delibes", country: "España", email: "miguel.delibes@gmail.com", password: "LosRitosDelAgua123" },
  { name: "Benito Pérez Galdós", country: "España", email: "benito.galdos@gmail.com", password: "FortunataYJacinta456" },
  { name: "Camilo José Cela", country: "España", email: "camilo.cela@gmail.com", password: "LaColmena789" },
  { name: "Rosalía de Castro", country: "España", email: "rosalia.castro@gmail.com", password: "EnLasOrillasDelSar123" },
  { name: "Ana María Matute", country: "España", email: "ana.matute@gmail.com", password: "OlvidadoReyGudú456" },
  { name: "Pío Baroja", country: "España", email: "pio.baroja@gmail.com", password: "LaVenganzaDeLaTierra789" },
  { name: "Luis de Góngora", country: "España", email: "luis.gongora@gmail.com", password: "Soledades123" },
];

const authorSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Author.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = authorList.map((author) => new Author(author));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }

    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

console.log("ANTES");
authorSeed(); // ESPERO VER: "Tenemos conexión", "Coches eliminados" y "Datos guardados correctamente!"
console.log("DESPUÉS");

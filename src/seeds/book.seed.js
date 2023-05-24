const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../model/Book.js");

const bookList = [
  {
    title: "Don Quijote de la Mancha",
    pages: 863,
    publisher: { name: "Editorial Castalia", country: "España" },
  },
  {
    title: "Cien años de soledad",
    pages: 471,
    publisher: { name: "Editorial Sudamericana", country: "España" },
  },
  {
    title: "La sombra del viento",
    pages: 545,
    publisher: { name: "Editorial Planeta", country: "España" },
  },
  {
    title: "La Regenta",
    pages: 951,
    publisher: { name: "Editorial Anaya", country: "España" },
  },
  {
    title: "El laberinto de las aceitunas",
    pages: 289,
    publisher: { name: "Editorial Alfaguara", country: "España" },
  },
  {
    title: "Los detectives salvajes",
    pages: 672,
    publisher: { name: "Editorial Tusquets", country: "España" },
  },
  {
    title: "La Casa de Bernarda Alba",
    pages: 112,
    publisher: { name: "Editorial Espasa Calpe", country: "España" },
  },
  {
    title: "Niebla",
    pages: 192,
    publisher: { name: "Editorial Aguilar", country: "España" },
  },
  {
    title: "El amor en los tiempos del cólera",
    pages: 368,
    publisher: { name: "Editorial Debolsillo", country: "España" },
  },
  {
    title: "Nada",
    pages: 215,
    publisher: { name: "Editorial Seix Barral", country: "España" },
  },
];

const bookSeed = async () => {
  try {
    const database = await connect();
    console.log("Tenemos conexión");

    console.log(database.connection.name);

    // Borrar datos
    await Book.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = bookList.map((book) => new Book(book));
    await Book.insertMany(documents);

    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

console.log("ANTES");
bookSeed(); // ESPERO VER: "Tenemos conexión", "Coches eliminados" y "Datos guardados correctamente!"
console.log("DESPUÉS");

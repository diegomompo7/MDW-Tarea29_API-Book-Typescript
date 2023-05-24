const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../model/Book.js");
const { Author } = require("../model/Author.js");
const { generateRandom } = require("../utils.js");

const carReslationsSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión!");

    // Recuperamos usuarios, coches y marcas
    const books = await Book.find();
    const authors = await Author.find();

    // Comprobar que existen coches
    if (!books.length) {
      console.error("No hay libros para relacionar en la base de datos");
      return;
    }

    if (!authors.length) {
      console.error("No hay autores para relacionar en la base de datos");
      return;
    }

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const randomAuthor = authors[generateRandom(0, authors.length - 1)];
      book.owner = randomAuthor.id;
      await book.save();
    }

    console.log("Relaciones entre coches-marcas-usuarios creadas correctamente.");
  } catch (error) {
  } finally {
    mongoose.disconnect();
  }
};

carReslationsSeed();

// Cargamos variables de entorno
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

dotenv.config();

// Cargamos variables de entorno
const DB_CONNECTION: string = process.env.DB_URL as string;
const DB_NAME: string = process.env.DB_NAME as string;

// Configuración de la conexión
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME
};

export const connect = async (): Promise<mongoose.Mongoose | null> => {
  const database = await mongoose.connect(DB_CONNECTION, config);
  const name = database.connection.name;
  const host = database.connection.host;
  console.log(`Conectado a la base de datos ${name} en el host ${host}`);
  return database
};

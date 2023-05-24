// Conexión a la BBDD;
import express from "express";

import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";

import { connect } from "./db";
import { bookRouter } from "./routes/book.routes";
import { authorRouter } from "./routes/author.routes";
// import { fileUploadRouter } from "./routes/file-upload.routes";
import cors from "cors";

const main = async (): Promise<void> => {
  const database = await connect();

  // Modelos

  const PORT = 3000;
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(
    cors({
      origin: "http://localhost:3000"
    })
  );

  // Rutas
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.send(`Esta es la RAIZ de nuestra API. Estamos utilizando la BBDD de ${database?.connection?.name as string} `);
  });
  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  server.use((req, res, next) => {
    const date = new Date();
    console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date.toString()}`);
    next();
  });

  server.use("/", router);
  server.use("/books", bookRouter);
  server.use("/authors", authorRouter);
  // server.use("/file-upload", fileUploadRouter);

  // Middleware de gestión de errores
  server.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else {
      res.status(500).json(err);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};
void main();

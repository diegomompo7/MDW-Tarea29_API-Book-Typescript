import express, { type NextFunction, type Response, type Request } from "express";
import bcrypt from "bcrypt";
import { Author } from "../model/Author.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { generateToken } from "../utils/token.js";

export const authorRouter = express.Router();

authorRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("Estamos en el middlware / car que comprueba parámetros");
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    req.query.page = page as any;
    req.query.limit = limit as any;
    next()
  } else {
    console.log("Parámetros no válidos")
    console.log(JSON.stringify(req.query))
    res.status(400).json({ error: "Params page or limit are not valid" })
  }
})

authorRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = req.query.page as any;
    const limit: number = req.query.limit as any;
    const authors = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Author.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPage: Math.ceil(totalElements / limit),
      currentPage: page,
      date: authors
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/title/:title", async (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;
  try {
    const author = await Author.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (author) {
      res.json(author);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  Author.findById(id)
    .then((author) => {
      if (author) {
        res.json(author);
      } else {
        res.status(404).json({});
      }
    })
    .catch((error) => res.status(500).json(error));
});

authorRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const author = new Author(req.body);
    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    res.status(500).json(error);
  }
});

authorRouter.delete("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (req.author.id !== id || req.author.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "1No tienes autorización para realizar esta operación" });
    }

    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
authorRouter.put("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (req.author.id !== id || req.author.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" })
    }

    const authorUpdated = await Author.findById(id);
    if (authorUpdated) {
      Object.assign(authorUpdated, req.body)
      await authorUpdated.save()
      const authorToSend: any = authorUpdated.toObject()
      delete authorToSend.password;
      res.json(authorToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

authorRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const author = await Author.findOne({ email }).select("+password");
    if (!author) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    const match = await bcrypt.compare(password, author.password);
    if (match) {
      // Quitamos password de la respuesta
      const authorWithoutPass: any = author.toObject();
      delete authorWithoutPass.password;

      const jwtToken = generateToken(author._id.toString(), author.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});

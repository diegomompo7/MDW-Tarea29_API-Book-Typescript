import express, { type NextFunction, type Response, type Request } from "express";
import { Book } from "../model/Book";

export const bookRouter = express.Router();

bookRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Estamos en el middlware / car que comprueba parámetros");
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page as any;
      req.query.limit = limit as any;
      next();
    } else {
      console.log("Parámetros no válidos");
      console.log(JSON.stringify(req.query));
      res.status(400).json({ error: "Params page or limit are not valid" });
    }
  } catch (error) {
    next(error);
  }
});

bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = req.query.page as any;
    const limit: number = req.query.limit as any;
    const books = await Book.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate(["author"]);

    const totalElements = await Book.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPage: Math.ceil(totalElements / limit),
      currentPage: page,
      date: books
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

bookRouter.get("/title/:title", async (req: Request, res: Response, next: NextFunction) => {
  const title = req.params.title;
  try {
    const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate(["author"]);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    next(error);
  }
});

bookRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const book = await Book.findById(id).populate(["author"]);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    next(error);
  }
});

bookRouter.post("/", async (req, res, next) => {
  try {
    const book = new Book(req.body);
    const createdBook = await book.save();
    return res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

bookRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const bookDeleted = await Book.findByIdAndDelete(id);
    if (bookDeleted) {
      res.json(bookDeleted);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    next(error);
  }
});
bookRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const bookUpdated = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (bookUpdated) {
      res.json(bookUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

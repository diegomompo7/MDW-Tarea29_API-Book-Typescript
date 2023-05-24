import mongoose, { type ObjectId } from "mongoose";
const Schema = mongoose.Schema;

const allowedCountries = ["ESPAÑA"];

export interface IBook {
  title: string;
  author: ObjectId;
  pages: number;
  publisher: {
    name: string;
    country: string;
  };
}

// Creamos el schema del usuario
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "El nombre debe tener mínimo 3 caracteres"],
      maxLength: [50, "El nombre debe ser inferior a 50 caracteres"],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: false
    },
    pages: {
      type: Number,
      required: false,
      min: 1,
      max: [10000, "Los libros tienen que ser menos de 10000 páginas, si no nadie los lee"]
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
          minLength: [3, "El nombre debe tener mínimo 3 caracteres"],
          maxLength: [50, "El nombre defe ser inferior a 50 caracteres"],
          trim: true
        },
        country: {
          type: String,
          required: true,
          enum: allowedCountries,
          uppercase: true,
          trim: true
        }
      }
    }
  },
  {
    timestamps: true
  }
);

export const Book = mongoose.model("Book", bookSchema);

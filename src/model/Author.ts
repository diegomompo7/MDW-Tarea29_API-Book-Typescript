import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const allowedCountries = ["ESPAÑA"];

export interface IAuthor {
  name: string;
  country: string;
  email: string;
  password: string;
  profileImage: string;
};

// Creamos el schema del usuario
const authorSchema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "El nombre debe tener mínimo 3 caracteres"],
      maxLength: [100, "El nombre debe ser inferior a 20 caracteres"],
      trim: true
    },
    country: {
      type: String,
      required: true,
      enum: allowedCountries,
      uppercase: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (text: string) => validator.isEmail(text),
        message: "Email incorrecto"
      }
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false
    },
    profileImage: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

authorSchema.pre("save", async function (next) {
  try {
    // Si la contraseña ya estaba encriptada, no la encriptamos de nuevo
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }

    next();
  } catch (error: any) {
    next(error);
  }
});
export const Author = mongoose.model("Author", authorSchema, "authors");

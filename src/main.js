// import dotenv from 'dotenv'
// dotenv.config()
import express from "express";
import morgan from "morgan";
import path from "node:path";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { router as homeRouter } from "./routes/home.route.js";
import { router as pageRouter } from "./routes/pages.route.js";
import { router as authRouter } from "./routes/auth.route.js";
import { router as aportesRouter } from "./routes/aportes.route.js";
import { router as colegiadosRouter } from "./routes/colegiados.route.js";
import { router as configRouter } from "./routes/config.route.js";
import { router as userRouter } from "./routes/usuarios.route.js";
import { router as talonarioRouter } from "./routes/talonario.route.js";
import { router as historialRouter } from "./routes/historial.route.js";
import { router as notaRouter } from "./routes/nota.route.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// template
app.set("view engine", "ejs");
// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
// token
app.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.session.user = data;
  } catch {
    req.session.user = null;
  }
  next();
});

// routes
app.use(configRouter);
app.use(colegiadosRouter);
app.use(aportesRouter);
app.use(talonarioRouter);
app.use(userRouter);
app.use(authRouter);
app.use(homeRouter);
app.use(pageRouter);
app.use(historialRouter);
app.use(notaRouter);

//statics
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//not found Page
app.use((req, res) => {
  const { user } = req.session;
  res.status(404).render("404", {
    message: "Pagina no encontrada",
    title: "Pagina no encontrada",
    user,
  }); // Render a custom 404 page
});
//puerto
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});

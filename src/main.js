// Cambiar las importaciones a CommonJS
const express = require("express");
const morgan = require("morgan");
const path = require("node:path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { fileURLToPath } = require("url");
const homeRouter = require("./routes/home.route.js");
const pageRouter = require("./routes/pages.route.js");
const authRouter = require("./routes/auth.route.js");
const aportesRouter = require("./routes/aportes.route.js");
const colegiadosRouter = require("./routes/colegiados.route.js");
const configRouter = require("./routes/config.route.js");
const userRouter = require("./routes/usuarios.route.js");
const talonarioRouter = require("./routes/talonario.route.js");
const historialRouter = require("./routes/historial.route.js");
const notaRouter = require("./routes/nota.route.js");

const app = express();

// Cambiar la manera de obtener __filename y __dirname
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

// statics
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// not found Page
app.use((req, res) => {
  const { user } = req.session;
  res.status(404).render("404", {
    message: "Pagina no encontrada",
    title: "Pagina no encontrada",
    user,
  }); // Render a custom 404 page
});

// puerto
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});

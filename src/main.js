const express = require("express");
const path = require("path");
const i18n = require('i18n');
const multer = require("multer");
const { sequelize } = require("./db/models");

const { User } = require("./db/models");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001;
const usersRouter = require("./routes/user.routes");
app.use(express.json());
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

dotenv.config();
const PORT = process.env.PORT || 3001;

// Configuración de i18n
i18n.configure({
  locales: ['es'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: process.env.IDIOMA,
  autoReload: true, // ¡Clave para que sea dinámico! Recarga cambios sin reiniciar
  updateFiles: false // Evita que i18n escriba nuevos archivos
});

//ROUTE 
const commentsRouter = require("./routes/comments.route");
const usersRouter = require("./routes/user.routes");
const postsRouter = require("./routes/post.routes");
const postImagesRouter = require("./routes/postimage.routes");
const app = express();

app.use(i18n.init);
app.use(express.json());
//app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//app.use("/comments", commentsRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
//app.use("/post-images", postImagesRouter);

/*
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("imagen")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});
*/
app.listen(PORT, async (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  await sequelize.sync({ force: true });
  console.log(`App iniciada en el puerto ${PORT}`);
});


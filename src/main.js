const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const i18n = require("i18n");
const { sequelize } = require("./db/models");
const errorMiddleware = require("./middlewares/error.middleware");

const PORT = process.env.PORT || 3001;
const locale = process.env.IDIOMA === "es" ? process.env.IDIOMA : "es";

i18n.configure({
  locales: ["es"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: locale,
  autoReload: true,
  updateFiles: false,
});
//ROUTE 
const commentsRouter = require("./routes/comments.route");
const usersRouter = require("./routes/user.routes");
const postsRouter = require("./routes/post.routes");
const postImagesRouter = require("./routes/postimage.routes");
const app = express();

app.use(i18n.init);
app.use(express.json());
app.use("/comments", commentsRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/post-images", postImagesRouter);

app.use(errorMiddleware);

app.listen(PORT, async (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  await sequelize.sync({ force: true });
  console.log(`App iniciada en el puerto ${PORT}`);
});

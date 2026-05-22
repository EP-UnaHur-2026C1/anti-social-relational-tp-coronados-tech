const express = require("express");
const { sequelize } = require("./db/models");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001;
const commentsRouter = require("./routes/comments.route");
const usersRouter = require("./routes/user.routes");

const app = express();

app.use(express.json());
app.use("/comments", commentsRouter);
app.use("/users", usersRouter);


app.listen(PORT, async (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  await sequelize.sync({ force: true });
  console.log(`App iniciada en el puerto ${PORT}`);
});

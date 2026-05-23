const express = require("express");
const app = express();
const { sequelize } = require("./db/models");
<<<<<<< HEAD
const { User } = require("./db/models");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001;
const usersRouter = require("./routes/user.routes");
app.use(express.json());
app.use("/users", usersRouter);
=======
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001;
const commentsRouter = require("./routes/comments.route");
app.use(express.json());
app.use("/comments", commentsRouter);
>>>>>>> 2adf093893b32ef70fe5eb4eb108ad52556fb5f6

app.listen(PORT, async (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  await sequelize.sync({ force: true });
  console.log(`App iniciada en el puerto ${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 2adf093893b32ef70fe5eb4eb108ad52556fb5f6

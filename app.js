require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const dbConnection = require("./database");

const app = express();
dbConnection();

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/signup", userRoutes);
app.use("/api/login", authRoutes);

const listener = app.listen(process.env.PORT, () => {
  const { port } = Object(listener.address());
  console.log(`Listening on port: ${port}`);
});

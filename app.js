require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

mongoose.connection.on("error", (err) => {
  console.log("error", err);
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(
    `<h4 style="font-family: sans-serif;">Is alive at ${new Date().toUTCString()}</h4>`
  );
});

app.use("/api/signup", userRoutes);
app.use("/api/login", authRoutes);

const listener = app.listen(process.env.PORT, () => {
  const { port } = Object(listener.address());
  console.log(`Listening on port: ${port}`);
});

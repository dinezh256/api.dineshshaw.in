require("dotenv").config();

const express = require("express");
const cors = require("cors");
// const userRoutes = require("./routes/users");
// const authRoutes = require("./routes/auth");
const viewRoutes = require("./routes/view");

const dbConnection = require("./database");
const { isDevelopment } = require("./utils");

const whitelist = ['https://api.dineshshaw.in', 'https://dineshshaw.in', 'https://www.dineshshaw.in', 'http://localhost:3000']

const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1 || isDevelopment ? true : !origin) {
      callback(null, true);
    } else {
      callback(new Error("Request from unauthorized origin"));
    }
  },
};



const app = express();
dbConnection();

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

// app.use("/api/signup", userRoutes);
// app.use("/api/login", authRoutes);
app.use("/api/views", viewRoutes);

const listener = app.listen(process.env.PORT, () => {
  const { port } = Object(listener.address());
  console.log(`Listening on port: ${port}`);
});

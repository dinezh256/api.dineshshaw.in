const mongoose = require("mongoose");

const dbName = "portfolio"
const uri = (process.env.NODE_ENV === "Dev"
  ? process.env.MONGODB_URL_LOCAL : process.env.MONGODB_URL) + `/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

module.exports = () => {
  const params = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(
      uri,
      params,
      () => console.log("Connected to DB successfully")
    );
  } catch (error) {
    console.log(error);
    console.log("Could not connect to DB");
  }
};

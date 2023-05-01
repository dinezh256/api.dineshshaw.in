const mongoose = require("mongoose");

module.exports = () => {
  const params = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(
      process.env.MONGODB_URL,
      params,
      () => console.log("Connected to DB successfully")
    );
  } catch (error) {
    console.log(error);
    console.log("Could not connect to DB");
  }
};

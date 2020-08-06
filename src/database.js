const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const initDB = () => {
  if (process.env.MONGODB_URI) {
    mongoose
      .connect(process.env.MONGODB_URI.toString(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log("Successfully connected to MongoDB"))
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
      });
  } else {
    console.error("Missing MONGODB_URI environment variable");
  }
};

exports.initDB = initDB;
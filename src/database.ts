import * as Bluebird from "bluebird";
import { MongoError } from "mongodb";
import * as mongoose from "mongoose";

(mongoose as any).Promise = Bluebird;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const initDB = () => {
  if (process.env.MONGODB_URI) {
    mongoose
      .connect(process.env.MONGODB_URI.toString(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log("Successfully connected to MongoDB"))
      .catch((err: MongoError) => {
        console.error("Error connecting to MongoDB:", err.message);
      });
  } else {
    console.error("Missing MONGODB_URI environment variable");
  }
};

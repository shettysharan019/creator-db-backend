import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./config/config.env",
});

app.on("error", (err) => {
    console.log("MongoDB connection error: ", err);
    throw err;
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection FAILED error: ", err);
})












import app from "./app.js";
/*
import express from "express";
const app = express()

(async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    app.on("error", (err) => {
      console.log("MongoDB connection error: ", err);
      throw err;
    })
    console.log("Connected to MongoDB", db.connection.name);

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    })
  } catch (error) {
    console.error("ERROR: ", error)
    throw err
  }
})();
*/
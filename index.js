import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Routes from "./routes/routes.js"
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config({ path: "config/config.env" });
mongoose.set('strictQuery', false);
app.use(bodyParser.json()); // transforme les données récuper sous format json en form url

app.use(bodyParser.urlencoded({ extended: true }));
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI
      ,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: true, //make this also true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();
app.use(
    cors({
      origin: "*",
    })
  );
app.use(Routes);

app.listen(process.env.PORT, console.log(process.env.PORT))
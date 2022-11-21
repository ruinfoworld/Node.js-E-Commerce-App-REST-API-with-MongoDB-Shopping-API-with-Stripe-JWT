import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";


dotenv.config();

const app = express();

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("Database connected sucessfully!!!");
  })
  .catch((err) => {
    console.log("Error in connection!!!!");
  });

app.use(cors());

app.use(express.json());

app.get("/api/test", () => {
    console.log("Test is successfull!!!!")
})

app.use("/api/user/",userRoute);

app.listen(process.nextTick.PORT_NO || 5000, () => {
  console.log("Connected!!!!");
});

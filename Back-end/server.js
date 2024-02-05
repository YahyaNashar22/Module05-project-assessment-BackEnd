import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/dbConfig.js";
import cors from "cors";
import { userRouter } from "./routes/usersRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import {orderRouter} from "./routes/orderRoutes.js"

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static("images"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);


app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/order",orderRouter)


const PORT = process.env.PORT;
app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Running, and App is listening on port " + PORT);
  } else {
    console.log("Error: ", error);
  }
});
connectDB();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//router import 
import userRouter from "./routes/team.routes.js";
import creatorRouter from "./routes/creator.routes.js";
import categoryRouter from "./routes/category.routes.js";
import commercialRouter from "./routes/commercial.routes.js";
import brandRouter from "./routes/brand.routes.js";

//router declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/creators", creatorRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/commercials", commercialRouter);
app.use("/api/v1/brands", brandRouter);


//http://localhost:8000/api/v1/users/register

export default app;
import express, { Request, Response, Application } from "express";
import morgan from "morgan";
import errorMiddleware from "./middleware/errorMiddleware";
import router from "./routes/router";
import * as dotenv from "dotenv";
dotenv.config({ path: "server/config/config.env" });

const app: Application = express();


app.use(morgan("tiny"));

app.use("/", (req: Request, res: Response) => res.send("Hello World"));

app.use("/api/v1", router);

app.use(errorMiddleware);

export default app;

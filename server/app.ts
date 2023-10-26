import express, { Request, Response, Application } from "express";
import morgan from "morgan";
import { errorMiddleware } from "async-express-error-handler";
import router from "./routes/router";
const app: Application = express();

app.use(morgan("tiny"));

app.use("/", (req: Request, res: Response) => res.send("Hello World"));

app.use("/api", router);

app.use(errorMiddleware);

export default app;

import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFoundHandlerWithParams from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://next-level-assignment-6-client.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers 👋!!!");
});

app.use(globalErrorHandler);
app.use(notFoundHandlerWithParams);

export default app;

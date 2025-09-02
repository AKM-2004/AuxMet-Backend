import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import chatRouter from "./routes/interview.router.js";
import router from "./routes/user.routes.js";
const app = express();

app.use(
    cors({
        origin: ["https://auxmet.com","http://62.72.58.72"], // frontend URL
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
        credentials: true,
    })
); // cross origin Resource sharing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded()); // parse the content-type and send it to the request
app.use(express.static("public"));
app.use(cookieParser()); // automatically parse the cookie
app.use(passport.initialize());
app.use("/api/v1/interview", chatRouter);
app.use("/api/v1/user", router);

export default app;

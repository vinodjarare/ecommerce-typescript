import app from "./app";
import http from "http";
import connectDatabase from "./config/db";


console.log(">>>>>>>>>>>>>>>>" + process.env.PORT);

connectDatabase();

const server = http.createServer(app);

const port = process.env.PORT || 8000;

server.listen(port, () => console.log("Server is running on port 5000"));

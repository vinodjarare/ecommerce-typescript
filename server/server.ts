import app from "./app";
import http from "http";

const server = http.createServer(app);

server.listen(5000, () => console.log("Server is running on port 5000"));

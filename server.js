import http from "http";
import app from "./app/app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 7000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

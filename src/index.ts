import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "../middlewares/logger.middleware.js";
import handleCredentialsRouter from "../routes/login.routes.js";
import handleRegisterUserRouter from "../routes/user.routes.js";
import handlePostUserRouter from "../routes/posts.routes.js";
import handleOrderRouter from "../routes/orders.routes.js";
import HandleOrdersByUserIdRouter from "../routes/orders.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(logger);
app.use(express.json());

app.use("/login", handleCredentialsRouter);
app.use("/users", handleRegisterUserRouter);
app.use("/posts", handlePostUserRouter);
app.use("/orders", handleOrderRouter);
app.use("/order_details", HandleOrdersByUserIdRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

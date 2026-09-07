import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Security & Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: [env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded assets
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Mount API routes
app.use("/api", router);

// Error Handling Middleware
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`⚡ Marvin Tattoos Atelier API running on http://localhost:${env.PORT}`);
  console.log(`⚡ Environment: ${env.NODE_ENV}`);
});

export default app;

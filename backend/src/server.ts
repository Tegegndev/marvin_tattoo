import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { syncHistoricalUsers } from "./services/userService.js";

const app = express();

// Security & Middlewares
// @ts-ignore
app.use((typeof helmet === "function" ? helmet : (helmet as any)?.default || helmet)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = [env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"];
      if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { getUploadDir } from "./config/multer.js";

// Serve static uploaded assets
try {
  app.use("/uploads", express.static(getUploadDir()));
} catch {}

// Mount API routes
app.use("/api", router);

// Error Handling Middleware
app.use(errorHandler);

app.listen(env.PORT, async () => {
  console.log(`⚡ Marvin Tattoos Atelier API running on http://localhost:${env.PORT}`);
  console.log(`⚡ Environment: ${env.NODE_ENV}`);

  // Automatically feed and synchronize clients database from bookings and orders
  try {
    const stats = await syncHistoricalUsers();
    console.log(`⚡ Client CRM Auto-Sync: ${stats.syncedUsers} clients populated from ${stats.totalBookings} bookings and ${stats.totalOrders} orders.`);
  } catch (err) {
    console.warn("Client CRM initial sync notice:", err);
  }
});

export default app;

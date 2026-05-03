import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// import userRoutes from "./routes/users.js";
// import authRoutes from "./routes/auth.js";
import viewRoutes from "./routes/view.js";
import connectDB from "./database.js";
import { isDevelopment } from "./utils.js";
import { mongoSanitize } from "./middleware/sanitize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const whitelist = [
  "https://api.dineshshaw.in",
  "https://dineshshaw.in",
  "https://www.dineshshaw.in",
  "http://localhost:3000",
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin) || isDevelopment) {
      callback(null, true);
    } else {
      callback(new Error("Request from unauthorized origin"));
    }
  },
};

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize); // Prevent NoSQL Injection
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(join(__dirname, "../public")));

// Routes
app.get("/", (_: Request, res: Response) => {
  res.sendFile(join(__dirname, "../index.html"));
});

// app.use("/api/signup", userRoutes);
// app.use("/api/login", authRoutes);
app.use("/api/views", viewRoutes);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).send({
    message: isDevelopment ? err.message : "Internal Server Error",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

export default app;

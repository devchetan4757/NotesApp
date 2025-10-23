
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";
import notesRouter from "./src/routes/notes.js";
import errorHandler from "./src/middleware/errorHandler.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Connecting MongoDB
connectDB(process.env.MONGODB_URI);

app.use("/api/notes", notesRouter);


// Frontend (static files)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

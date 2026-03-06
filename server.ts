import express from "express";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

import fs from "fs/promises";
import { mkdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = "pp_alchemist_secret_key_2026";
const ADMIN_USER = "admin";
const ADMIN_PASS = "pp_alchemist_access1003";
const CONTENT_FILE = path.join(__dirname, "content.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  const UPLOADS_DIR = path.join(__dirname, "public", "uploads");

  // Ensure uploads directory exists
  try {
    await mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

  // Serve uploads directory
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Auth middleware
  const authenticateAdmin = (req: any, res: any, next: any) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000, // 1 hour
      });
      return res.json({ success: true });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
  });

  app.get("/api/verify", (req, res) => {
    const token = req.cookies.admin_token;

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return res.json({ authenticated: true });
    } catch (err) {
      return res.status(401).json({ authenticated: false });
    }
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ success: true });
  });

  // Content Management Routes
  app.get("/api/content", async (req, res) => {
    try {
      const data = await fs.readFile(CONTENT_FILE, "utf-8");
      // Use aggressive no-cache headers to ensure the browser always gets the latest content.
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Failed to read content" });
    }
  });

  app.post("/api/content", authenticateAdmin, async (req, res) => {
    try {
      const newContent = req.body;
      await fs.writeFile(CONTENT_FILE, JSON.stringify(newContent, null, 2));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to save content" });
    }
  });

  app.post("/api/upload", authenticateAdmin, upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

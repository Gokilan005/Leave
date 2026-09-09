const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

// Make io accessible to our router/controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

// Root & Healthcheck endpoints
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Smart Leave System API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 500px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); text-align: center; }
          .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.1); color: #34d399; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; border: 1px solid rgba(16,185,129,0.2); margin-bottom: 20px; }
          .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
          h1 { margin: 0 0 8px; font-size: 24px; color: #ffffff; }
          p { color: #94a3b8; font-size: 14px; margin: 0 0 24px; }
          .endpoints { text-align: left; background: #0f172a; border-radius: 8px; padding: 16px; border: 1px solid #334155; font-size: 13px; font-family: monospace; }
          .ep { margin: 6px 0; color: #38bdf8; }
          .method { color: #a78bfa; font-weight: bold; }
          @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> Backend API Operational</div>
          <h1>Smart Leave System</h1>
          <p>Express REST API & Socket.io WebSocket server is running successfully.</p>
          <div class="endpoints">
            <div class="ep"><span class="method">POST</span> /api/auth/login</div>
            <div class="ep"><span class="method">POST</span> /api/auth/register</div>
            <div class="ep"><span class="method">GET</span>  /api/leaves</div>
            <div class="ep"><span class="method">POST</span> /api/leaves</div>
            <div class="ep"><span class="method">PUT</span>  /api/leaves/:id/status</div>
            <div class="ep"><span class="method">GET</span>  /health</div>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    status: "online",
    message: "Smart Leave Notification System API is running 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      leaves: "/api/leaves",
      health: "/health"
    },
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smartleave")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

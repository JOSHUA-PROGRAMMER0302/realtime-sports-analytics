// server.js — Main entry point for the Data Router backend
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const matchStatsRouter = require("./routes/matchStats");
const registerStreamHandler = require("./sockets/streamHandler");

// ── Express setup ──────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());

// ── REST routes ────────────────────────────────────────────────
app.use("/api", matchStatsRouter);

// Health-check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ── HTTP + Socket.io ───────────────────────────────────────────
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // tighten this to your React app's URL in production
    methods: ["GET", "POST"],
  },
});

// Register WebSocket event handlers
registerStreamHandler(io);

// ── Start listening ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀  Data Router listening on http://localhost:${PORT}`);
});

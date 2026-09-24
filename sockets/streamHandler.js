// sockets/streamHandler.js — Relay YOLOv8 bounding-box data to React clients

/**
 * Registers Socket.io event handlers on the given server instance.
 *
 * Expected flow:
 *   Python CV engine  ──[ python_frame_data ]──►  this server
 *   this server       ──[ react_live_feed   ]──►  React frontend
 *
 * @param {import("socket.io").Server} io
 */
function registerStreamHandler(io) {
  io.on("connection", (socket) => {
    console.log(`✅  Client connected: ${socket.id}`);

    // Relay every frame from the Python CV engine to all React clients
    socket.on("python_frame_data", (data) => {
      io.emit("react_live_feed", data);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌  Client disconnected: ${socket.id} (${reason})`);
    });
  });
}

module.exports = registerStreamHandler;

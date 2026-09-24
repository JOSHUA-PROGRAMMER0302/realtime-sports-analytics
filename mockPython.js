const { io } = require("socket.io-client");

// Connect to your local Data Router
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("🟢 Mock Python Vision Engine Connected!");
  
  // Send a fake YOLOv8 bounding box payload every 1 second
  setInterval(() => {
    const payload = {
      timestamp: new Date().toISOString(),
      players: [
        { track_id: 1, bbox: [100, 50, 150, 200], speed_kmh: (Math.random() * 20).toFixed(1) },
        { track_id: 2, bbox: [300, 150, 350, 300], speed_kmh: (Math.random() * 20).toFixed(1) }
      ]
    };
    
    socket.emit("python_frame_data", payload);
    console.log("📡 Emitted frame data:", payload.timestamp);
  }, 1000);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from server");
});

const express = require("express");
const mongoose = require("mongoose");
const countRoute = require("./routes/CountRoute");
const http = require("http"); // For creating the HTTP server
const socketIo = require("socket.io"); // For creating the Socket.io server
const cors = require("cors");
const Count = require("./models/count"); // Ensure to require the Count model

// Create Express app
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
}); // Create WebSocket server

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json()); // Body parser middleware

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use count route
app.use("/count", countRoute(io));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ujjwalpandey922:ujjwalpandey922@cluster0.nvpexv7.mongodb.net/"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  // Example: Emit initial count value when a new client connects
  Count.findOne()
    .then((countDoc) => {
      if (countDoc) {
        socket.emit("countUpdate", countDoc.LiveCount);
      }
    })
    .catch((error) => {
      console.error("Error fetching initial count:", error);
    });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();

module.exports = io; // Export `io` instance

const express = require("express");
const router = express.Router();
const Count = require("../models/count"); // Ensure the model name is correct
// const io = require("../index"); // Import the WebSocket server instance

const countRoute = (io) => {
  const router = express.Router();

  // GET endpoint to retrieve the current count
  router.get("/", async (req, res, next) => {
    try {
      // Find the count document, if it doesn't exist, return 0
      const countDoc = await Count.findOne();
      if (!countDoc) {
        return res.json({ count: 0 });
      }
      // Return the current count value
      res.json({ count: countDoc.LiveCount });
    } catch (error) {
      next(error);
    }
  });

  // POST endpoint to increment the count
  router.post("/", async (req, res, next) => {
    try {
      // Find the count document, if it doesn't exist, create one with count 0
      let countDoc = await Count.findOne();
      if (!countDoc) {
        countDoc = new Count({ LiveCount: 0 });
      }

      // Increment the count by 20
      countDoc.LiveCount += 20;

      // Save the updated count
      await countDoc.save();

      // Emit the updated count value to all connected WebSocket clients
      io.emit("countUpdate", countDoc.LiveCount);

      // Send the updated count back to the frontend
      res.json({ count: countDoc.LiveCount });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = countRoute;

const express = require("express");
const router = express.Router();
const Destination = require("../models/destinationModel");

// Get a random destination (only clues)
router.get("/random", async (req, res) => {
  try {
    const randomDestination = await Destination.aggregate([{ $sample: { size: 1 } }]);
    if (!randomDestination.length) return res.status(404).json({ error: "No destinations found" });

    res.json({
      id: randomDestination[0]._id,
      clues: randomDestination[0].clues,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Check user's guess
router.post("/guess", async (req, res) => {
  const { id, userGuess } = req.body;

  try {
    const destination = await Destination.findById(id);
    if (!destination) return res.status(404).json({ error: "Destination not found" });

    const isCorrect = destination.city.toLowerCase() === userGuess.toLowerCase();

    res.json({
      success: isCorrect,
      message: isCorrect ? "Correct!" : "Incorrect!",
      funFact: destination.fun_fact[Math.floor(Math.random() * destination.fun_fact.length)],
      showConfetti: isCorrect,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

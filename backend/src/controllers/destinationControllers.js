const Destination = require("../models/Destination");

// Get a random destination
const getRandomDestination = async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(randomIndex);

    if (!destination) return res.status(404).json({ message: "No destinations found" });

    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getRandomDestination };

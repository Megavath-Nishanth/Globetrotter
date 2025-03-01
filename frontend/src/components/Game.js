import React, { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import "./Game.css"; // Import the CSS file

const Game = () => {
  const [clue, setClue] = useState(""); 
  const [destinationId, setDestinationId] = useState(null);
  const [userGuess, setUserGuess] = useState(""); 
  const [feedback, setFeedback] = useState({ message: "", funFact: "", correct: null });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  useEffect(() => {
    fetchRandomClue();
  }, []);

  const fetchRandomClue = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/destinations/random"); 
      console.log("API Response:", response.data);

      setClue(response.data.clues[Math.floor(Math.random() * response.data.clues.length)]);
      setDestinationId(response.data.id);
      
      // Reset all game state
      setFeedback({ message: "", funFact: "", correct: null });
      setShowConfetti(false);
      setUserGuess("");
      setShowSubmitButton(true); // Show submit button again for new round
    } catch (error) {
      console.error("Error fetching clue:", error);
    }
  };

  const checkGuess = async () => {
    if (!userGuess.trim()) return alert("Please enter a guess!");

    try {
      const response = await axios.post("http://localhost:5000/api/destinations/guess", {
        id: destinationId,
        userGuess,
      });

      if (response.data.success) {
        setShowConfetti(true);
        setFeedback({ 
          message: "🎉 Correct!", 
          funFact: `Fun Fact: ${response.data.funFact}`, 
          correct: true 
        });
      } else {
        setFeedback({ 
          message: "😥 Incorrect! Try Again.", 
          funFact: "", 
          correct: false 
        });
        setShowSubmitButton(false); // Hide submit button if the guess is wrong
      }
    } catch (error) {
      console.error("Error checking guess:", error);
    }
  };

  return (
    <div className="game-container">
      {showConfetti && <Confetti />}

      <div className="game-box">
        <h1 className="title">The Globetrotter</h1>
        <h2 className="game-title">Guess the City!</h2>
        <p className="game-clue">{clue ? `"${clue}"` : "Loading clue..."}</p>

        <input
          type="text"
          className="input-box"
          placeholder="Enter your guess..."
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
        />

        {showSubmitButton && (
          <button onClick={checkGuess} className="submit-button">
            Submit Guess
          </button>
        )}

        {/* Display feedback message and fun fact */}
        {feedback.message && (
          <>
            <div className={`feedback-message ${feedback.correct ? "correct" : "incorrect"}`}>
              {feedback.message}
            </div>
            {feedback.correct && feedback.funFact && (
              <div className="fun-fact">🎉 {feedback.funFact}</div>
            )}
          </>
        )}

        {/* Play Again button to reset the game */}
        <button onClick={fetchRandomClue} className="play-again-button">
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Game;

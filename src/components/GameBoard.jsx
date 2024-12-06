import React, { useState, useEffect } from "react";
import "./App.css";

// Function to generate a random candy grid
const generateGrid = (rows, cols) => {
  const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const rowArr = [];
    for (let col = 0; col < cols; col++) {
      rowArr.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    grid.push(rowArr);
  }
  return grid;
};

function App() {
  const [grid, setGrid] = useState(generateGrid(8, 8));  // 8x8 grid
  const [score, setScore] = useState(0);

  const swapCandies = (x1, y1, x2, y2) => {
    // Swap candies logic and update grid
    const newGrid = [...grid];
    [newGrid[x1][y1], newGrid[x2][y2]] = [newGrid[x2][y2], newGrid[x1][y1]];
    setGrid(newGrid);

    // Check for matches after swapping
    checkMatches();
  };

  const checkMatches = () => {
    // Basic match checking logic (horizontal and vertical)
    let newScore = 0;
    const newGrid = [...grid];

    // Example for horizontal match
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length - 2; col++) {
        if (grid[row][col] === grid[row][col + 1] && grid[row][col] === grid[row][col + 2]) {
          newGrid[row][col] = null;  // Remove matching candies
          newGrid[row][col + 1] = null;
          newGrid[row][col + 2] = null;
          newScore += 100;
        }
      }
    }
    
    setScore(newScore);  // Update score
    setGrid(newGrid);    // Update grid
  };

  // Render the game grid with interactive tiles
  return (
    <div className="game">
      <h1>Welcome to Candy Crush!</h1>
      <p>Score: {score}</p>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((candy, colIndex) => (
              <div
                key={colIndex}
                className={`tile ${candy}`}
                onClick={() => swapCandies(rowIndex, colIndex, rowIndex + 1, colIndex)}  // Example swap interaction
              >
                {candy[0].toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

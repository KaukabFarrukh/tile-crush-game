import React, { useState, useEffect } from "react";
import './styles/App.css';

const App = () => {
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(createGrid());
  const [firstTile, setFirstTile] = useState(null);
  const [secondTile, setSecondTile] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const matchSound = new Audio('/assets/newsound.mp3');
  matchSound.volume = 1;

  const gameOverSound = new Audio('/assets/gameover.mp3');
  gameOverSound.volume = 0.8;

  function createGrid() {
    const colors = ['#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#FF69B4'];
    let newGrid = [];
    for (let i = 0; i < 64; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      newGrid.push(randomColor);
    }
    return newGrid;
  }

  const handleTileClick = (index) => {
    if (gameOver) return;

    if (firstTile === null) {
      setFirstTile(index);
    } else if (secondTile === null) {
      setSecondTile(index);
      swapTiles(firstTile, index);
    }
  };

  const swapTiles = (firstIndex, secondIndex) => {
    let newGrid = [...grid];
    const temp = newGrid[firstIndex];
    newGrid[firstIndex] = newGrid[secondIndex];
    newGrid[secondIndex] = temp;

    if (checkForMatches(newGrid)) {
      newGrid = removeMatchedTiles(newGrid);
      matchSound.play(); // Play match sound when matches are found
      setGrid(newGrid);
      setScore(score + 20);
    } else {
      newGrid[firstIndex] = newGrid[secondIndex];
      newGrid[secondIndex] = temp;
      setGrid(newGrid);
    }

    setFirstTile(null);
    setSecondTile(null);

    if (!canMakeMove(newGrid)) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameOver) {
      gameOverSound.play(); // Play game-over sound when the game ends
    }
  }, [gameOver]);

  const checkForMatches = (newGrid) => {
    let matchFound = false;

    for (let i = 0; i < 64; i++) {
      const color = newGrid[i];
      if (i % 8 < 6 && color === newGrid[i + 1] && color === newGrid[i + 2]) {
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      for (let i = 0; i < 56; i++) {
        const color = newGrid[i];
        if (color === newGrid[i + 8] && color === newGrid[i + 16]) {
          matchFound = true;
          break;
        }
      }
    }

    return matchFound;
  };

  const removeMatchedTiles = (newGrid) => {
    let updatedGrid = [...newGrid];

    for (let i = 0; i < 64; i++) {
      const color = newGrid[i];
      if (i % 8 < 6 && color === newGrid[i + 1] && color === newGrid[i + 2]) {
        updatedGrid[i] = null;
        updatedGrid[i + 1] = null;
        updatedGrid[i + 2] = null;
      }
      if (color === newGrid[i + 8] && color === newGrid[i + 16]) {
        updatedGrid[i] = null;
        updatedGrid[i + 8] = null;
        updatedGrid[i + 16] = null;
      }
    }

    updatedGrid = refillGrid(updatedGrid);
    return updatedGrid;
  };

  const refillGrid = (updatedGrid) => {
    for (let col = 0; col < 8; col++) {
      for (let row = 7; row >= 0; row--) {
        const currentIndex = row * 8 + col;
        if (updatedGrid[currentIndex] === null) {
          for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
            const aboveIndex = aboveRow * 8 + col;
            updatedGrid[currentIndex] = updatedGrid[aboveIndex];
            updatedGrid[aboveIndex] = null;
          }
          updatedGrid[col] = generateRandomTile();
        }
      }
    }
    return updatedGrid;
  };

  const generateRandomTile = () => {
    const colors = ['#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#FF69B4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const canMakeMove = (newGrid) => {
    for (let i = 0; i < 56; i++) {
      const color = newGrid[i];
      if (
        (i % 8 < 6 && color === newGrid[i + 1] && color === newGrid[i + 2]) || 
        (color === newGrid[i + 8] && color === newGrid[i + 16])
      ) {
        return true;
      }
    }
    return false;
  };

  const startNewGame = () => {
    setScore(0);
    setGrid(createGrid());
    setGameOver(false);
  };

  const renderGrid = () => {
    return grid.map((color, index) => (
      <div
        key={index}
        className="tile"
        style={{ backgroundColor: color }}
        onClick={() => handleTileClick(index)}
      />
    ));
  };

  return (
    <div className="game-container">
      <h1>Tile Crush Game</h1>
      <div className="instructions">
        <h3>How to Play:</h3>
        <p>
          Click on two adjacent tiles to swap their positions. If a match of
          three or more tiles with the same color is made, they will disappear, 
          and you will earn points. Keep playing to rack up your score!
        </p>
        <p>
          The goal is to get the highest score possible before the game ends. Have fun!
        </p>
      </div>

      <div className="scoreboard">
        <div className="score">Score: {score}</div>
      </div>
      <div className="grid">{renderGrid()}</div>

      <div className="animated-background">
  {Array.from({ length: 100 }).map((_, i) => (
    <div
      key={i}
      className="star"
      style={{
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
      }}
    />
  ))}
</div>

      <button onClick={startNewGame} className="start-button">
        Start New Game
      </button>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your final score: {score}</p>
        </div>
      )}
    </div>
  
  );
};

export default App;

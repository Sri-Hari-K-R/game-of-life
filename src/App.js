import "./App.css";
import React, { useCallback, useState, useRef } from "react";
import { produce } from "immer";

const numRows = 40;
const numCols = 40;

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];
function App() {
  const generateEmptyGrid = () => {
    const rows = [];

    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  };
  const generateRandomGrid = () => {
    const rows = [];

    for (let i = 0; i < numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }
    return rows;
  };

  const [darkMode, setDarkMode] = useState(false);
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);

  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 200);
  }, []);

  return (
    <>
      <div
        className="text-center"
        style={{
          backgroundColor: `${darkMode ? "#282c34" : "white"}`,
        }}
      >
        <button
          className={`${
            darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"
          }`}
          style={{ margin: "10px" }}
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "stop" : "start"}
        </button>
        <button
          className={`${
            darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"
          }`}
          style={{ margin: "10px" }}
          onClick={() => {
            setGrid(generateRandomGrid);
          }}
        >
          random
        </button>
        <button
          className={`${
            darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"
          }`}
          style={{ margin: "10px" }}
          onClick={() => {
            setGrid(generateEmptyGrid);
          }}
        >
          clear
        </button>
        <button
          className={`${
            darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"
          }`}
          style={{ margin: "10px" }}
          onClick={() => {
            setDarkMode(!darkMode);
          }}
        >
          toggle dark mode
        </button>
        <a
          className={`${
            darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"
          }`}
          style={{ margin: "10px" }}
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
          rel="noreferrer"
        >
          about
        </a>
      </div>
      <div
        className="App"
        style={{
          justifyContent: "center",
          backgroundColor: `${darkMode ? "#282c34" : "white"}`,
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 30px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((cols, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                width: 30,
                height: 30,
                border: `solid 1px  ${darkMode ? "white" : "#282c34"}`,
                backgroundColor: grid[i][j]
                  ? `${darkMode ? "#f5f4f3" : "black"}`
                  : undefined,
              }}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;

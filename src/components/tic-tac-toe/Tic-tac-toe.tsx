import React, { useState } from "react";
import { Board } from "./Board";
import "./tic-tac-toe.sass";

type BoardArray = Array<Array<string | null>>;

const makeComputerMove = (board: BoardArray): [number, number] => {
  const emptyCells: [number, number][] = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (!cell) {
        emptyCells.push([rowIndex, cellIndex]);
      }
    });
  });

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};

const checkWinner = (board: BoardArray): string | null => {
  const lines = [
    // 3 rows
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],

    // 3 columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],

    // 2 diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const line of lines) {
    if (line[0] && line[0] === line[1] && line[1] === line[2]) {
      return line[0];
    }
  }

  return null;
};

const TicTacToe = () => {
  const [board, setBoard] = useState<BoardArray>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
  );

  const [player, setPlayer] = useState<string>("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const handleOnClick = (row: number, col: number) => {
    if (board[row][col] || winner || isDraw) {
      return;
    }

    const updatedPlayerBoard = board.map((newRow, rowIndex) =>
      newRow.map((cell, cellIndex) =>
        rowIndex === row && cellIndex === col ? player : cell
      )
    );

    setBoard(updatedPlayerBoard);

    const newWinner = checkWinner(updatedPlayerBoard);
    setWinner(newWinner);

    // Check if the board is full (no empty cells)
    const hasNullValue = updatedPlayerBoard.some((row) =>
      row.some((cell) => cell === null)
    );

    if (!newWinner && !hasNullValue) {
      setIsDraw(true);
      return;
    }

    setPlayer("X");

    if (!newWinner) {
      const [computerRow, computerCol] = makeComputerMove(updatedPlayerBoard);
      const updatedComputerBoard = updatedPlayerBoard.map((newRow, rowIndex) =>
        newRow.map((cell, cellIndex) =>
          rowIndex === computerRow && cellIndex === computerCol ? "O" : cell
        )
      );

      setTimeout(() => {
        setBoard(updatedComputerBoard);
        setWinner(checkWinner(updatedComputerBoard));
      }, 200);
    }
  };

  return (
    <div>
      <h1 className="game">Tic Tac Toe</h1>
      <Board board={board} handleClick={handleOnClick} />
      {winner && <p>{winner === "X" ? "You win!" : "You lose!"}</p>}
      {isDraw && <p>It's a draw!</p>}
    </div>
  );
};

export default TicTacToe;

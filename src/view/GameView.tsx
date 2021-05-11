import React, { useEffect, useState } from 'react';
import { Cell, GameOfLife, Location } from '../domain/GameOfLife';
import { CellView } from './CellView';
import './game-view.css';

const game = new GameOfLife(50, 50);

export const GameView = () => {
  const [board, setBoard] = useState(() => game.getBoard());

  useEffect(() => {
    game.forEachCell((_, location) => {
      game.setCell(location, Math.random() >= 0.5 ? Cell.Alive : Cell.Dead);
    });

    setBoard([...game.getBoard()]);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      game.nextGeneration();
      setBoard([...game.getBoard()]);
    }, 400);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="game-board">
      {board.map((row, y) => row.map((cell, x) => <CellView key={`${y}-${x}`} cell={cell} />))}
    </div>
  );
};

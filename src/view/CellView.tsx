import React from 'react';
import { Cell } from '../domain/GameOfLife';
import './cell-view.css';

interface CellViewProps {
  cell: Cell;
  onClick?(): void;
}

export const CellView: React.FC<CellViewProps> = React.memo((props: CellViewProps) => {
  const className = `game-board__cell game-board__cell--${props.cell === Cell.Alive ? 'alive' : 'dead'}`;
  return <div className={className} onClick={props.onClick} />;
});

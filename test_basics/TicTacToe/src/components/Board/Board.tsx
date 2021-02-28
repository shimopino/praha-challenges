import React from 'react';
import { Square } from '../Square/Square';
import { SquareValue } from '../../types/tictactoe';
import './Board.css';

export interface Props {
  squares: SquareValue[];
  onClick(i: number): void;
}

export const Board = ({ squares, onClick }: Props): JSX.Element => {
  const SquareRender = (index: number) => {
    return (
      <Square
        value={squares[index]}
        onClick={() => onClick(index)}
        key={index}
      />
    );
  };
  return (
    <>
      <div className="board-row">
        {SquareRender(0)}
        {SquareRender(1)}
        {SquareRender(2)}
      </div>
      <div className="board-row">
        {SquareRender(3)}
        {SquareRender(4)}
        {SquareRender(5)}
      </div>
      <div className="board-row">
        {SquareRender(6)}
        {SquareRender(7)}
        {SquareRender(8)}
      </div>
    </>
  );
};

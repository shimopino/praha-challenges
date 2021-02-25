import React from 'react';
import { Square } from '../Square/Square';
import { SquareValue } from '../../types';
import './Board.css';

export interface Props {
  squares: SquareValue[];
  onClick(i: number): void;
}

export const Board: React.FC<Props> = ({ squares, onClick }: Props) => {
  return (
    <>
      {[0, 1, 2].map((rowIndex) => {
        return (
          <div className="board-row" key={rowIndex}>
            {[0, 1, 2].map((colIndex) => {
              const index = 3 * rowIndex + colIndex;
              return (
                <Square
                  value={squares[index]}
                  onClick={() => onClick(index)}
                  key={index}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
};

import React from 'react';
import './Move.css';
import { BoardValue } from '../../types/tictactoe';

export interface Props {
  history: BoardValue[];
  jumpTo: (step: number) => void;
}

export const Move = ({ history, jumpTo }: Props) => {
  const moves = history.map((step, move) => {
    const desc = move ? `Go to move#${move}` : `Go to game start`;
    return (
      <li>
        <button type="button" onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });

  return <ol>{moves}</ol>;
};

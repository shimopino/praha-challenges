import React from 'react';
import { BoardValue } from '../../types/tictactoe';
import { Board } from '../Board/Board';
import { Status } from '../Status/Status';
import { Move } from '../Move/Move';

export interface Props {
  status: string;
  current: BoardValue;
  history: BoardValue[];
  handleClick: (i: number) => void;
  jumpTo: (step: number) => void;
}

export const Game = ({
  status,
  current,
  history,
  handleClick,
  jumpTo,
}: Props): JSX.Element => (
  <div className="game">
    <div className="game-board">
      <Board squares={current.squares} onClick={(i) => handleClick(i)} />
    </div>
    <div className="game-info">
      <Status status={status} />
      <Move history={history} jumpTo={jumpTo} />
    </div>
  </div>
);

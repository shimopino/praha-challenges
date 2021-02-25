import React from 'react';
import { Game } from '../components/Game/Game';
import { useTicTacToe } from '../hooks/useTicTacToe';

export const Page = (): JSX.Element => {
  const [status, current, history, handleClick, jumpTo] = useTicTacToe();

  return <Game {...{ status, current, history, handleClick, jumpTo }} />;
};

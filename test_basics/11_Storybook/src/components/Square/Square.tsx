import React from 'react';
import { SquareValue } from '../../types';
import './Square.css';

export interface Props {
  value: SquareValue;
  onClick(): void;
}

export const Square: React.FC<Props> = ({ value, onClick }: Props) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

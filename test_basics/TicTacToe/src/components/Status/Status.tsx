import React from 'react';
import './Status.css';

export interface Props {
  status: string;
}

export const Status = ({ status }: Props) => (
  <div data-e2e="status">{status}</div>
);

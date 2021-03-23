import { ErrorMessage } from './enums';
import { validateArgRange } from './validate';

export const multiply = (...args: number[]): number => {
  validateArgRange(args);

  const MAX_RESULT = 1000;

  const result = args.reduce((previous: number, current: number): number => {
    return previous * current;
  });

  if (result > MAX_RESULT) {
    throw new Error(ErrorMessage.TOO_TOO_BIG);
  }

  return result;
};

export const add = (...args: number[]): number => {
  validateArgRange(args);

  const MAX_RESULT = 1000;

  const result = args.reduce((previous: number, current: number) => {
    return previous + current;
  });

  if (result > MAX_RESULT) {
    throw new Error(ErrorMessage.TOO_BIG);
  }

  return result;
};

export const subtract = (...args: number[]): number => {
  validateArgRange(args);

  const result = args.reduce((previous: number, current: number) => {
    return previous - current;
  });

  if (result < 0) {
    throw new Error(ErrorMessage.NEGATIVE);
  }

  return result;
};

export const divide = (arg1: number, arg2: number): number => {
  return arg1 / arg2;
};

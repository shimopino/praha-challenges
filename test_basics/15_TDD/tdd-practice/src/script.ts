import { validateArgRange } from './validate';

export const multiply = (...args: number[]): number => {
  validateArgRange(args);

  const MAX_RESULT = 1000;

  const result = args.reduce(
    (previousValue: number, currentValue: number): number => {
      return previousValue * currentValue;
    },
  );

  if (result > MAX_RESULT) {
    throw new Error('big big number');
  }

  return result;
};

export const add = (...args: number[]): number => {
  validateArgRange(args);

  return args.reduce((previous: number, current: number) => {
    return previous + current;
  });
};

export const multiply = (...args: number[]): number => {
  return args.reduce((previousValue: number, currentValue: number): number => {
    return previousValue * currentValue;
  });
};

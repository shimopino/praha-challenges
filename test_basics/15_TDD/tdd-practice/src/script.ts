const MAX_ARGS_LENGTH = 30;

export const multiply = (...args: number[]): number => {
  if (args.length > MAX_ARGS_LENGTH) {
    throw new Error('引数の数は30個以内にしてください');
  }

  return args.reduce((previousValue: number, currentValue: number): number => {
    return previousValue * currentValue;
  });
};

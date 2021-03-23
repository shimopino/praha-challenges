const MIN_ARGS_LENGTH = 1;
const MAX_ARGS_LENGTH = 30;

export const multiply = (...args: number[]): number => {
  const MAX_RESULT = 1000;

  if (args.length < MIN_ARGS_LENGTH || args.length > MAX_ARGS_LENGTH) {
    throw new Error('引数の数は1個以上30個以内にしてください');
  }

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
  if (args.length < MIN_ARGS_LENGTH || args.length > MAX_ARGS_LENGTH) {
    throw new Error('引数の数は1個以上30個以内にしてください');
  }

  return args.reduce((previous: number, current: number) => {
    return previous + current;
  });
};

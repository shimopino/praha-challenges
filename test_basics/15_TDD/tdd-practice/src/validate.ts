import { ErrorMessage } from './enums';

export const validateArgRange = (args: number[]) => {
  const MIN_ARGS_LENGTH = 1;
  const MAX_ARGS_LENGTH = 30;

  if (args.length < MIN_ARGS_LENGTH || args.length > MAX_ARGS_LENGTH) {
    throw new Error(ErrorMessage.ARG_RANGE);
  }
};

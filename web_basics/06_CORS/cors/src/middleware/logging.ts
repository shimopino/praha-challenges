import { RequestHandler, Request, Response, NextFunction } from 'express';

const loggingHandler = (option: string): RequestHandler => {
  console.log(`logging setting: ${option}`);

  return (req: Request, res: Response, next: NextFunction): void => {
    console.log(req.headers);
    next();
  };
};

export default loggingHandler;

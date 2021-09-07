import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';

const formatOptions = {
  tiny: ':method :url :status',
  short: ':remote-addr :method :url HTTP/:http-version :status',
};

const token = (
  template: string,
  param: string,
  fn: CallableFunction,
): string => {
  return template.replace(param, fn());
};

const loggingHandler = (option: string): RequestHandler => {
  if (!(option in formatOptions)) {
    option = 'tiny';
  }

  let template: string = formatOptions[option];

  return (req: Request, res: Response, next: NextFunction): void => {
    template = token(template, 'method', () => req.method);
    template = token(template, 'url', () => req.originalUrl || req.url);
    template = token(template, 'status', () => req.statusCode);
    template = token(
      template,
      'http-version',
      () => req.httpVersionMajor + '.' + req.httpVersionMinor,
    );
    template = token(template, 'remote-addr', () => req.ip);

    console.log(template);
    next();
  };
};

export default loggingHandler;

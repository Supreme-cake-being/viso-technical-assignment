import { RequestHandler } from 'express';
import { HttpError } from 'helpers';

const uuidRegexp =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const isValidId = (key: string): RequestHandler => {
  return (req, _, next) => {
    const params = req.params;

    if (!uuidRegexp.test(params[key])) {
      return next(HttpError(404, `Not found`));
    }
    next();
  };
};

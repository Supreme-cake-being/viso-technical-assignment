import { RequestHandler } from 'express';
import { HttpError } from 'helpers';
import { Schema } from 'joi';

export const validateQuery = (schema: Schema) => {
  const func: RequestHandler = (req, _, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

import { RequestHandler } from 'express';
import { HttpError } from 'helpers';
import { Schema } from 'joi';

export const validateBody = (schema: Schema) => {
  const func: RequestHandler = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

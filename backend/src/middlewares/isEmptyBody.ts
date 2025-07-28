import { RequestHandler } from 'express';
import { HttpError } from '../helpers/index.js';

export const isEmptyBody: RequestHandler = (req, _, next) => {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400, 'Missing fields'));
  }
  next();
};

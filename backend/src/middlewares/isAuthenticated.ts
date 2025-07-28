import { ctrlWrapper } from 'decorators';
import { RequestHandler } from 'express';
import { HttpError } from 'helpers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from 'prisma/prismaClient';

const isAuthenticatedMiddleware: RequestHandler = async (req, _, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    throw HttpError(401, 'Not authorized');
  }

  try {
    const { id } = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw HttpError(401, 'Not authorized');
    }

    req.user = user;

    next();
  } catch (error) {
    next(HttpError(401, 'Not authorized'));
  }
};

export const isAuthenticated = ctrlWrapper(isAuthenticatedMiddleware);

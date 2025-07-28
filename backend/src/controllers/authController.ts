import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpError } from 'helpers';
import { ctrlWrapper } from 'decorators';
import prisma from 'prisma/prismaClient';

const { JWT_SECRET } = process.env;

const signup: RequestHandler = async (req, res) => {
  const { email, name, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    throw HttpError(409, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      ...req.body,
      password: hashedPassword,
    },
  });

  res.status(201).json({ name, email });
};

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const comparedPassword = await bcrypt.compare(password, user.password);
  if (!comparedPassword) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: '7d',
  });

  await prisma.user.update({ where: { id: user.id }, data: { token: token } });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/',
  });

  res.json({
    token,
  });
};

const logout: RequestHandler = async (req, res) => {
  const user = req.user;
  await prisma.user.update({
    where: { id: user?.id },
    data: { token: { set: null } },
  });

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.status(204).send();
};

const currentUser: RequestHandler = async (req, res) => {
  const user = req.user;

  res.json({
    email: user?.email,
    name: user?.name,
  });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  currentUser: ctrlWrapper(currentUser),
};

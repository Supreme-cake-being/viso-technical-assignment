import { RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from 'drizzle';
import { users } from 'drizzle/schema';
import { HttpError, sendEmail } from 'helpers';
import { ctrlWrapper } from 'decorators';

const { JWT_SECRET } = process.env;

const signup: RequestHandler = async (req, res) => {
  const { email, name, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (user) {
    throw HttpError(409, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomUUID();

  await db
    .insert(users)
    .values({ ...req.body, password: hashedPassword, verificationToken });

  await sendEmail(email, name, verificationToken);

  res.status(201).json({ name, email, verificationToken });
};

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verified) {
    throw HttpError(403, 'Forbidden request due to not verified email');
  }

  const comparedPassword = await bcrypt.compare(password, user.password);
  if (!comparedPassword) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: '7d',
  });

  await db.update(users).set({ token }).where(eq(users.id, user.id));

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
  await db.update(users).set({ token: null }).where(eq(users.id, user?.id));

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.status(204).send();
};

const verify: RequestHandler = async (req, res) => {
  const { verificationToken } = req.params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.verificationToken, verificationToken));

  if (!user) {
    throw HttpError(404, 'Not found');
  }

  await db
    .update(users)
    .set({
      verificationToken: null,
      verified: true,
    })
    .where(eq(users.id, user.id));

  res.json({ message: 'Verification successful' });
};

const resendEmail: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    throw HttpError(404, 'Not found');
  }
  if (user.verified) {
    throw HttpError(400, 'Email is already verified');
  }

  await sendEmail(email, user.name, user.verificationToken as string);

  res.json({
    message:
      'Verification email has been resent successfully. Please check your inbox',
  });
};

const currentUser: RequestHandler = async (req, res) => {
  const user = req.user;

  res.json({
    email: user?.email,
    name: user?.name,
    age: user?.age,
    gender: user?.gender,
    weight: user?.weight,
    height: user?.height,
  });
};

const edit: RequestHandler = async (req, res) => {
  const user = req.user;
  const { name, age, gender, weight, height } = req.body;

  await db
    .update(users)
    .set({
      name,
      age,
      gender,
      weight,
      height,
    })
    .where(eq(users.id, user?.id));

  res.json({ name, age, gender, weight, height });
};

const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    throw HttpError(404, 'Not found');
  }

  const restorationToken = crypto.randomUUID();
  const target = 'restoration';

  await db
    .update(users)
    .set({ restorationToken, token: null })
    .where(eq(users.id, user?.id));

  await sendEmail(email, user.name, restorationToken, target);

  res.json({
    message:
      'Password restoration email has been sent successfully. Please check your inbox',
  });
};

const restorePassword: RequestHandler = async (req, res) => {
  const { restorationToken } = req.params;
  const { password } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.restorationToken, restorationToken));
  if (!user) {
    throw HttpError(404, 'Not found');
  }

  const comparedPassword = await bcrypt.compare(password, user.password);
  if (comparedPassword) {
    throw HttpError(
      409,
      'Your password cannot be the same as the previous one'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({
      restorationToken: null,
      password: hashedPassword,
    })
    .where(eq(users.id, user.id));

  res.json({ message: 'You successfully changed your password' });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  verify: ctrlWrapper(verify),
  resendEmail: ctrlWrapper(resendEmail),
  currentUser: ctrlWrapper(currentUser),
  edit: ctrlWrapper(edit),
  forgotPassword: ctrlWrapper(forgotPassword),
  restorePassword: ctrlWrapper(restorePassword),
};

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from 'routes/authRouter';
import recipeRouter from 'routes/recipeRouter';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/users', authRouter);
app.use('/api/recipes', recipeRouter);

app.get('/api/ping', async (_req: express.Request, res: express.Response) => {
  res.status(200).send('pong');
});

app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const status = err.status || 500;
    const message = err.message || 'Server error';
    res.status(status).json({ message });
  }
);

export default app;

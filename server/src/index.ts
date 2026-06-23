import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { connectDB } from './config/db';
import { setupPassport } from './config/passport';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import protocolsRouter from './routes/protocols';
import scheduleRouter from './routes/schedule';
import vialsRouter from './routes/vials';
import trackingRouter from './routes/tracking';
import catalogRouter from './routes/catalog';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(passport.initialize());

setupPassport();

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/protocols', protocolsRouter);
app.use('/schedule', scheduleRouter);
app.use('/vials', vialsRouter);
app.use('/tracking', trackingRouter);
app.use('/catalog', catalogRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

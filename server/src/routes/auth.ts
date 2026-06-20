import { Router, Request, Response } from 'express';
import passport from 'passport';
import { User, IUser } from '../models/User';
import { signToken } from '../middleware/auth';

const router = Router();

// Helper — redirect back to the app with a JWT
function redirectWithToken(res: Response, user: IUser): void {
  const id = (user._id as unknown as { toString(): string }).toString();
  const token = signToken(id);
  const clientUrl = process.env.CLIENT_URL ?? 'exp://localhost:8081';
  res.redirect(`${clientUrl}?token=${token}&userId=${id}`);
}

// ── Google ────────────────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req: Request, res: Response) => {
    redirectWithToken(res, req.user as IUser);
  }
);

// ── Apple ─────────────────────────────────────────────────────────────────────
router.get('/apple', passport.authenticate('apple', { session: false }));

router.post(
  '/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: '/auth/failure' }),
  (req: Request, res: Response) => {
    redirectWithToken(res, req.user as IUser);
  }
);

// ── Guest ─────────────────────────────────────────────────────────────────────
router.post('/guest', async (_req: Request, res: Response) => {
  const user = await User.create({
    provider: 'guest',
    isGuest: true,
  });
  const guestId = (user._id as unknown as { toString(): string }).toString();
  const token = signToken(guestId);
  res.json({ token, userId: guestId });
});

// ── Failure ───────────────────────────────────────────────────────────────────
router.get('/failure', (_req, res) => {
  res.status(401).json({ error: 'OAuth authentication failed' });
});

export default router;

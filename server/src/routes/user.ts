import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();
router.use(requireAuth);

// GET /user/me
router.get('/me', async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId).lean();
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json(user);
});

// PATCH /user/me  — update displayName
router.patch('/me', async (req: AuthRequest, res: Response) => {
  const { displayName } = req.body as { displayName?: string };
  const user = await User.findByIdAndUpdate(
    req.userId,
    { displayName },
    { new: true, runValidators: true }
  ).lean();
  res.json(user);
});

// PATCH /user/me/onboarding
router.patch('/me/onboarding', async (req: AuthRequest, res: Response) => {
  const update = req.body as Record<string, unknown>;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { onboarding: update } },
    { new: true, runValidators: true }
  ).lean();
  res.json(user);
});

export default router;

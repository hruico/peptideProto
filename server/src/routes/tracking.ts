import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { TrackingSession } from '../models/Tracking';

const router = Router();
router.use(requireAuth);

// GET /tracking
router.get('/', async (req: AuthRequest, res: Response) => {
  const sessions = await TrackingSession.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
  res.json(sessions);
});

// POST /tracking
router.post('/', async (req: AuthRequest, res: Response) => {
  const data = req.body as Record<string, unknown>;
  const existing = await TrackingSession.findOneAndUpdate(
    { userId: req.userId, _id: data._id ?? undefined },
    { ...data, userId: req.userId },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();
  res.status(201).json(existing);
});

// DELETE /tracking/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await TrackingSession.deleteOne({ _id: req.params.id, userId: req.userId });
  res.status(204).send();
});

// PATCH /tracking/:id/photo
router.patch('/:id/photo', async (req: AuthRequest, res: Response) => {
  const { baselinePhotoUri } = req.body as { baselinePhotoUri: string };
  const session = await TrackingSession.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { baselinePhotoUri },
    { new: true }
  ).lean();
  if (!session) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(session);
});

export default router;

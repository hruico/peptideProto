import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { ActiveProtocol } from '../models/Protocol';
import { ActivityLog } from '../models/Tracking';

const router = Router();
router.use(requireAuth);

// GET /protocols
router.get('/', async (req: AuthRequest, res: Response) => {
  const protocols = await ActiveProtocol.find({ userId: req.userId }).sort({ startedAt: -1 }).lean();
  res.json(protocols);
});

// POST /protocols
router.post('/', async (req: AuthRequest, res: Response) => {
  const { protocolId, name } = req.body as { protocolId: string; name: string };

  // Upsert — replace if already active
  const protocol = await ActiveProtocol.findOneAndUpdate(
    { userId: req.userId, protocolId },
    { userId: req.userId, protocolId, name, startedAt: new Date() },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  // Log activity
  await ActivityLog.create({
    userId: req.userId,
    type: 'protocol_started',
    title: `Started: ${name}`,
    relatedId: protocolId,
    date: new Date().toISOString(),
  });

  res.status(201).json(protocol);
});

// DELETE /protocols/:protocolId
router.delete('/:protocolId', async (req: AuthRequest, res: Response) => {
  await ActiveProtocol.deleteOne({ userId: req.userId, protocolId: req.params.protocolId });
  res.status(204).send();
});

// GET /protocols/activity
router.get('/activity', async (req: AuthRequest, res: Response) => {
  const logs = await ActivityLog.find({ userId: req.userId }).sort({ date: -1 }).limit(50).lean();
  res.json(logs);
});

export default router;

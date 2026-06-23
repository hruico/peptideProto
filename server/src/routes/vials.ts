import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Vial, Blend } from '../models/Vial';
import { ActivityLog } from '../models/Tracking';

const router = Router();
router.use(requireAuth);

// ── Vials ─────────────────────────────────────────────────────────────────────

// GET /vials
router.get('/', async (req: AuthRequest, res: Response) => {
  const vials = await Vial.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
  res.json(vials);
});

// POST /vials
router.post('/', async (req: AuthRequest, res: Response) => {
  const data = req.body as Record<string, unknown>;
  const vial = await Vial.create({ ...data, userId: req.userId });

  await ActivityLog.create({
    userId: req.userId,
    type: 'vial_saved',
    title: `Reconstituted: ${data.peptideName}`,
    relatedId: (vial._id as unknown as { toString(): string }).toString(),
    date: new Date().toISOString(),
  });

  res.status(201).json(vial.toObject());
});

// PATCH /vials/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const vial = await Vial.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body as Record<string, unknown>,
    { new: true, runValidators: true }
  ).lean();
  if (!vial) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(vial);
});

// DELETE /vials/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await Vial.deleteOne({ _id: req.params.id, userId: req.userId });
  res.status(204).send();
});

// ── Blends ────────────────────────────────────────────────────────────────────

// GET /vials/blends
router.get('/blends', async (req: AuthRequest, res: Response) => {
  const blends = await Blend.find({ userId: req.userId }).lean();
  res.json(blends);
});

// POST /vials/blends
router.post('/blends', async (req: AuthRequest, res: Response) => {
  const data = req.body as Record<string, unknown>;
  const blend = await Blend.create({ ...data, userId: req.userId, isCustom: true });
  res.status(201).json(blend.toObject());
});

// DELETE /vials/blends/:id
router.delete('/blends/:id', async (req: AuthRequest, res: Response) => {
  await Blend.deleteOne({ _id: req.params.id, userId: req.userId });
  res.status(204).send();
});

// POST /vials/blends/:id/peptides  — add peptide to a blend
router.post('/blends/:id/peptides', async (req: AuthRequest, res: Response) => {
  const blend = await Blend.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $push: { peptides: req.body } },
    { new: true }
  ).lean();
  if (!blend) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(blend);
});

export default router;

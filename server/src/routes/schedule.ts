import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { ScheduledPeptide, TakenDose } from '../models/Schedule';

const router = Router();
router.use(requireAuth);

// GET /schedule
router.get('/', async (req: AuthRequest, res: Response) => {
  const peptides = await ScheduledPeptide.find({ userId: req.userId }).lean();
  const taken = await TakenDose.find({ userId: req.userId }).distinct('doseKey');
  res.json({ scheduledPeptides: peptides, takenDoses: taken });
});

// POST /schedule
router.post('/', async (req: AuthRequest, res: Response) => {
  const data = req.body as Record<string, unknown>;
  const peptide = await ScheduledPeptide.findOneAndUpdate(
    { userId: req.userId, _id: data._id ?? undefined },
    { ...data, userId: req.userId },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();
  res.status(201).json(peptide);
});

// DELETE /schedule/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await ScheduledPeptide.deleteOne({ _id: req.params.id, userId: req.userId });
  res.status(204).send();
});

// POST /schedule/doses  — mark dose taken
router.post('/doses', async (req: AuthRequest, res: Response) => {
  const { doseKey } = req.body as { doseKey: string };
  await TakenDose.updateOne(
    { userId: req.userId, doseKey },
    { userId: req.userId, doseKey, takenAt: new Date() },
    { upsert: true }
  );
  res.status(204).send();
});

// DELETE /schedule/doses/:doseKey  — unmark dose
router.delete('/doses/:doseKey', async (req: AuthRequest, res: Response) => {
  await TakenDose.deleteOne({ userId: req.userId, doseKey: req.params.doseKey });
  res.status(204).send();
});

export default router;

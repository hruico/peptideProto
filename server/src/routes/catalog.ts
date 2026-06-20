import { Router, Request, Response } from 'express';
import { CatalogPeptide, CatalogProtocol, CatalogGoal, CatalogBlend } from '../models/Catalog';

// Catalog routes are public — no auth required
const router = Router();

// GET /catalog/peptides
router.get('/peptides', async (_req: Request, res: Response) => {
  const peptides = await CatalogPeptide.find().lean();
  res.json(peptides);
});

// GET /catalog/peptides/:id
router.get('/peptides/:id', async (req: Request, res: Response) => {
  const peptide = await CatalogPeptide.findOne({ id: req.params.id }).lean();
  if (!peptide) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(peptide);
});

// GET /catalog/protocols
router.get('/protocols', async (_req: Request, res: Response) => {
  const protocols = await CatalogProtocol.find().lean();
  res.json(protocols);
});

// GET /catalog/protocols/:id
router.get('/protocols/:id', async (req: Request, res: Response) => {
  const protocol = await CatalogProtocol.findOne({ id: req.params.id }).lean();
  if (!protocol) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(protocol);
});

// GET /catalog/goals
router.get('/goals', async (_req: Request, res: Response) => {
  const goals = await CatalogGoal.find().lean();
  res.json(goals);
});

// GET /catalog/blends
router.get('/blends', async (_req: Request, res: Response) => {
  const blends = await CatalogBlend.find().lean();
  res.json(blends);
});

export default router;

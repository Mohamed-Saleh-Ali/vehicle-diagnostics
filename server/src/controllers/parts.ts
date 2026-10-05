import type { RequestHandler } from 'express';
import { PART_CATEGORIES } from '#config';
import { Part } from '#models';
import { httpError } from '#middlewares';
import { partQuerySchema, type PartCreateDTO, type PartUpdateDTO } from '#schemas';

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/parts?q=pad&category=Brakes
export const getParts: RequestHandler = async (req, res) => {
  const parsed = partQuerySchema.safeParse(req.query);
  if (!parsed.success) throw httpError(400, parsed.error.issues[0]?.message ?? 'Invalid query');
  const { q, category } = parsed.data;

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (q) {
    const pattern = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: pattern }, { partNumber: pattern }, { description: pattern }];
  }

  const parts = await Part.find(filter).sort({ category: 1, name: 1 }).limit(200);
  res.json(parts);
};

// GET /api/parts/categories
export const getCategories: RequestHandler = (_req, res) => {
  res.json(PART_CATEGORIES);
};

// GET /api/parts/:id
export const getPartById: RequestHandler<{ id: string }> = async (req, res) => {
  const part = await Part.findById(req.params.id);
  if (!part) throw httpError(404, 'Part not found');
  res.json(part);
};

// POST /api/parts (admin)
export const createPart: RequestHandler<unknown, unknown, PartCreateDTO> = async (req, res) => {
  const part = await Part.create({ ...req.body, createdBy: req.user!.id });
  res.status(201).json(part);
};

// PUT /api/parts/:id (admin)
export const updatePart: RequestHandler<{ id: string }, unknown, PartUpdateDTO> = async (req, res) => {
  const part = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!part) throw httpError(404, 'Part not found');
  res.json(part);
};

// DELETE /api/parts/:id (admin)
export const deletePart: RequestHandler<{ id: string }> = async (req, res) => {
  const part = await Part.findByIdAndDelete(req.params.id);
  if (!part) throw httpError(404, 'Part not found');
  res.status(204).end();
};

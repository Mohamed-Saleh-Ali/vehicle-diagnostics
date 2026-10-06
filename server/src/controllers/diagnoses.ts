import type { RequestHandler } from 'express';
import { Diagnosis } from '#models';
import { httpError } from '#middlewares';
import { runDiagnosis } from '#services';
import type { DiagnosisRequestDTO } from '#schemas';

// 404 if missing, 403 if it belongs to another user
const findOwnDiagnosis = async (id: string, userId: string) => {
  const diagnosis = await Diagnosis.findById(id);
  if (!diagnosis) throw httpError(404, 'Diagnosis not found');
  if (diagnosis.owner.toString() !== userId) throw httpError(403, 'This diagnosis belongs to another user');
  return diagnosis;
};

// POST /api/diagnoses
// runDiagnosis throws a 502 if the model fails, so nothing is saved in that case
export const createDiagnosis: RequestHandler<unknown, unknown, DiagnosisRequestDTO> = async (req, res) => {
  const { symptomDescription, vehicleNote } = req.body;
  const { result, source } = await runDiagnosis({ symptomDescription, vehicleNote });

  const diagnosis = await Diagnosis.create({
    symptomDescription,
    vehicleNote: vehicleNote ?? '',
    result,
    source,
    owner: req.user!.id
  });
  res.status(201).json(diagnosis);
};

// GET /api/diagnoses (own diagnoses only)
export const getMyDiagnoses: RequestHandler = async (req, res) => {
  const diagnoses = await Diagnosis.find({ owner: req.user!.id }).sort({ createdAt: -1 }).limit(100);
  res.json(diagnoses);
};

// GET /api/diagnoses/:id
export const getDiagnosisById: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await findOwnDiagnosis(req.params.id, req.user!.id));
};

// DELETE /api/diagnoses/:id
export const deleteDiagnosis: RequestHandler<{ id: string }> = async (req, res) => {
  const diagnosis = await findOwnDiagnosis(req.params.id, req.user!.id);
  await diagnosis.deleteOne();
  res.status(204).end();
};

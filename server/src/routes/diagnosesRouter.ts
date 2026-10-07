import { Router } from 'express';
import { createDiagnosis, deleteDiagnosis, getDiagnosisById, getMyDiagnoses } from '#controllers';
import { authenticate, diagnosisLimiter, validateBody } from '#middlewares';
import { diagnosisRequestSchema } from '#schemas';

const diagnosesRouter = Router();

diagnosesRouter.use(authenticate);

diagnosesRouter.post('/', diagnosisLimiter, validateBody(diagnosisRequestSchema), createDiagnosis);
diagnosesRouter.get('/', getMyDiagnoses);
diagnosesRouter.get('/:id', getDiagnosisById);
diagnosesRouter.delete('/:id', deleteDiagnosis);

export default diagnosesRouter;
